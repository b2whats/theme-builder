import React from 'react'
import { css } from '@emotion/css'
import type { StyleProperties, StateSelectors } from './StyleProperties'
import { objectStyleToString } from './StyleProperties'
import { mergeObject } from './mergeTheme'
import { Tokens } from './tokens'

const Test = () => React.createElement('div')

type MaybeArray<Item> = Item extends []
  ? Item | Item[number]
  : Item[] | Item

export type Slot<Props = unknown> = unknown extends Props
  ? StyleProperties & StateSelectors & { withProps: boolean }
  : Props & { withProps: boolean, component: any }

type ShortHands = 'p' | 'px' | 'py' | 'm' | 'mx' | 'my'
export type ComponentTheme<Props, Slots> = {
  defaultProps?: Partial<Props>
  mapProps?: (props: Props) => Omit<Partial<Props>, ShortHands> | void | false
  slots: {
    [Name in keyof Slots]: {
      type?: 'tag' | 'component',
      styles: Parts<Props, Slots[Name]>[]
    }
  }
}

type ComputeTheme<Theme> = Theme extends ComponentTheme<infer _, infer Slots>
    ? {
      [Name in keyof Slots]: Slots[Name] extends Slot<infer Props>
        ? {
          type: 'component',
          props: Props
        } : {
          type: 'tag',
          className: string,
        } 
    }
    : never
type PropertyAsFunction<Map, Args> = { 
  [Key in keyof Map]?: NonNullable<Map[Key]> extends object
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
    return function cssRewrite(props, tokens, slotStyles) {
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

const shortHands = {
  m: (value: any) => ({ mt: value, mr: value, mb: value, ml: value }),
  mx: (value: any) => ({ mr: value, ml: value }),
  my: (value: any) => ({ mt: value, mb: value }),
  p: (value: any) => ({ pt: value, pr: value, pb: value, pl: value }),
  px: (value: any) => ({ pr: value, pl: value }),
  py: (value: any) => ({ pt: value, pb: value }),
}

const isObject = (value: any): value is object => value && value.constructor && value.constructor === Object

function expandShorthands<T>(
  styles: T
): T {
  let results = {} as T

  if (!isObject(styles)) return styles

  for (let [key, value] of Object.entries(styles)) {
    if (shortHands[key]) {
      Object.assign(results, shortHands[key](value))

      continue
    }
    if (['disabled', 'hover', 'active', 'visited', 'checked'].includes(key)) {
      results[key] = expandShorthands(value)
    }

    results[key] = value
  }

  return results
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

export class ThemeBuilder<Theme extends ComponentTheme<any, any>> {
  theme = {
    slots: {}
  } as Theme

  cache = new WeakMap()

  slot<Name extends keyof this['theme']['slots']>(
    name: Name,
    styles: this['theme']['slots'][Name]['styles'] | this['theme']['slots'][Name]['styles'][number],
    type?: 'component' | 'tag'
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
  merge(builder: this | undefined): this {
    if (!builder) return this

    if (this.cache.has(builder)) return this.cache.get(builder)

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

    this.cache.set(builder, instance)

    return instance as this
  }
  compute(props: this['theme']['defaultProps'], tokens: Tokens): ComputeTheme<this['theme']> {
    const result = {} as any

    props = {
      ...this.theme.defaultProps,
      ...expandShorthands(props),
    }

    if (this.theme.mapProps) {
      Object.assign(props, this.theme.mapProps(props))
    }
    
    for (let [name, { type, styles }] of Object.entries(this.theme.slots)) {
      if (type === 'tag') {
        let slotStyles = {}

        const className = styles.map(style => {
          if (typeof style === 'string') {
            return css(style)
          }
  
          if (typeof style === 'object') {
            if (style.withProps) {
              style = {
                ...style,
                ...props,
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
          type,
          className,
        }
      } else {
        const componentProps = styles.map(style => {
          if (typeof style === 'object') {
            if (style.withProps) {
              style = {
                ...style,
                ...props,
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
          type,
          props: componentProps as any,
        }
      }

    }

    return result
  }
}