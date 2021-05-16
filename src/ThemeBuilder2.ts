// @ts-nocheck
import { css } from '@emotion/css'
import type { StyleProperties, StateSelectors } from './StyleProperties'
import { objectStyleToString, expandShorthands } from './StyleProperties'
import { mergeObject, weakMemoize, memoize } from './merge'
import { Tokens } from './tokens'

type MaybeArray<Item> = Item extends []
  ? Item | Item[number]
  : Item[] | Item

export type Slot<Props = unknown> = unknown extends Props
  ? StyleProperties & StateSelectors & { withProps: boolean, as: string }
  : Props & { withProps: boolean, as: any, _component: any } // _component нужно для поиска

type ShortHands = 'p' | 'px' | 'py' | 'm' | 'mx' | 'my'
export type ComponentTheme<Props, Slots> = {
  defaultProps?: Partial<Props>
  mapProps?: (props: Props) => Omit<Partial<Props>, ShortHands> | void | false
  slots: {
    [Name in keyof Slots]: {
      type?: keyof JSX.IntrinsicElements,
      styles: Parts<Props, Slots[Name]>[]
    }
  }
}

type ComputeTheme<Theme> = Theme extends ComponentTheme<infer _, infer Slots>
    ? {
      [Name in keyof Slots]: Slots[Name] extends Slot<infer Props>
        ? {
          type: any,
          props: Props
        } : {
          type: keyof JSX.IntrinsicElements,
          className: string,
        } 
    }
    : never

type PropertyAsFunction<Map, Args> = { 
  [Key in keyof Map]?: Key extends 'withProps'
    ? Map[Key] | ((props: Args) => Omit<Partial<Map>, ShortHands>) // Можно упростить
    : NonNullable<Map[Key]> extends object
      ? PropertyAsFunction<Map[Key], Args>
      : Map[Key] | ((props: Args) => Map[Key])
}

type Parts<ExternalProps, SlotProps> = SlotProps extends StateSelectors
  ? string
    | PropertyAsFunction<SlotProps, ExternalProps>
    | ((props: ExternalProps, tokens: Tokens, slotStyles: SlotProps) => string)
  : PropertyAsFunction<SlotProps, ExternalProps>

type SwitchMap<Props, Prop extends keyof Props, Result> = {
  [Value in Extract<Props[Prop], string>]?: Result | ((props: Props) => Result | undefined)
}

interface SlotUtils {
  if<ExternalProps, Props extends MaybeArray<keyof ExternalProps>, Values, PropertyValues extends Values>(
    prop: Props | Props[],
    value: PropertyValues,
    defaultValue?: PropertyValues,
  ): (props: ExternalProps) => Values | undefined
  map<ExternalProps, Prop extends keyof ExternalProps, Values, Default extends Values>(
    prop: Prop,
    body: SwitchMap<ExternalProps, Prop, Values>,
    defaultValue?: Default,
  ): (props: ExternalProps) => Values | undefined
  css<ExternalProps, SlotProps>(
    literals: TemplateStringsArray,
    ...placeholders: Array<(props: ExternalProps, tokens: Tokens, slotStyles: SlotProps) => string>
  ): (props: ExternalProps, tokens: Tokens, slotStyles: SlotProps) => string
}

export const utils: SlotUtils = {
  if: (keys, value, defaultValue) => {
    return (props: any) => {
      const isValue = Array.isArray(keys)
        ? keys.every(key => Boolean(props[key]))
        : Boolean(props[keys])
      
      return isValue ? value : defaultValue
    }
  },
  map: (prop, options, defaultValue) => {
    return (props: any) => {
      const value = props[prop]

      return (typeof options[value] === 'function' ? options[value](props) : options[value]) || defaultValue
    }
  },
  css: (literals, ...placeholders) => {
    return (props, tokens, slotStyles) => {
      let result = ''

      for (let i = 0; i < placeholders.length; i++) {
          result += literals[i];
          result += placeholders[i](props, tokens, slotStyles)
      }
  
      result += literals[literals.length - 1];

      return result
    }
  }
}

const weight = (val: any): number => {
  if (typeof val === 'string') return 1
  if (typeof val === 'object') return 2
  if (typeof val === 'function') return 3

  return 0
}

export function mergeStyles<Styles extends Parts<any, any>>(arr: Styles[]): Styles[] {
  return arr.sort((a, b) => weight(a) - weight(b)).reduce<Styles[]>((acc, cur) => {
    const prev = acc[acc.length - 1]
    if (typeof prev !== typeof cur || typeof cur === 'function') {
      acc.push(cur)

      return acc
    }

    if (typeof prev === 'string' && typeof cur === 'string') {
      (acc[acc.length - 1] as string) = prev + cur

      return acc
    }
    if (typeof prev === 'object' && typeof cur === 'object') {
      (acc[acc.length - 1] as object) = mergeObject(prev as object, cur as object)

      return acc
    }

    return acc
  }, [])

}

export class ThemeBuilder<Props> {


  constructor() {
    this.merge = weakMemoize(this.merge.bind(this))
  }

  slot<Name extends keyof this['theme']['slots']>(
    name: Name,
    styles: this['theme']['slots'][Name]['styles'] | this['theme']['slots'][Name]['styles'][number],
    type?: this['theme']['slots'][Name]['type']
  ) {
    this.theme.slots[name] = { 
      type,
      styles: Array.isArray(styles)
        ? mergeStyles((styles as []).map(expandShorthands))
        : [expandShorthands(styles)]
    }

    return this
  }
  defaultProps(props: this['theme']['defaultProps']) {
    if (!props) return this

    this.theme.defaultProps = expandShorthands(props)

    return this
  }
  mapProps(map: this['theme']['mapProps']) {
    this.theme.mapProps = map

    return this
  }
  merge(builder?: this) {
    if (!builder) return this

    const instance = new ThemeBuilder<Theme>()

    if (this.theme.defaultProps || builder.theme.defaultProps) {
      instance.defaultProps(
        Object.assign({}, this.theme.defaultProps, builder.theme.defaultProps)
      )
    }

    if (this.theme.mapProps || builder.theme.mapProps) {
      instance.mapProps((props) => ({
        ...this.theme.mapProps && this.theme.mapProps(props),
        ...builder.theme.mapProps && builder.theme.mapProps(props),
      }))
    }

    for (let [name, parts] of Object.entries(this.theme.slots)) {
      instance.slot(name, mergeStyles([
        ...parts.styles,
        ...builder.theme.slots[name] ? builder.theme.slots[name].styles : [],
      ]), parts.type)
    }

    return instance
  }
  compute = weakMemoize((tokens: Tokens) => memoize((props: this['theme']['defaultProps']): ComputeTheme<this['theme']> => {
    const result = {} as any

    props = {
      ...this.theme.defaultProps,
      ...expandShorthands(props),
    }

    if (this.theme.mapProps) {
      Object.assign(props, this.theme.mapProps(props))
    }
    
    for (let [name, { type, styles }] of Object.entries(this.theme.slots)) {
      if (type) {
        let slotStyles = {} as any

        const className = styles.map(style => {
          if (typeof style === 'string') {
            return css(style)
          }
  
          if (typeof style === 'object') {
            if (style.withProps) {
              style = {
                ...style,
                ...typeof style.withProps === 'function' ? style.withProps(props) : props,
              }
            }
            slotStyles = style
            return css(objectStyleToString(props, tokens, style as Slot))
          }
  
          if (typeof style === 'function') {
            return css(style(props, tokens, slotStyles))
          }
  
          return ''
        }).join(' ')

        result[name] = {
          type: slotStyles.as || type,
          className,
        }
      } else {
        const componentProps = styles.map(style => {
          if (typeof style === 'object') {
            if (style.withProps) {
              style = {
                ...style,
                ...typeof style.withProps === 'function' ? style.withProps(props) as object : props,
              }

              delete style.withProps
            }

            const result = {}
            for (let prop in style) {
              result[prop] = typeof style[prop] === 'function'
                ? style[prop](props)
                : style[prop]
            }

            return result
          }

          return {}
        }).reduce((acc, curr) => {
          Object.assign(acc, curr)

          return acc
        })

        result[name] = {
          type: props.as || type,
          props: componentProps as any,
        }
      }

    }

    return result
  }))
}