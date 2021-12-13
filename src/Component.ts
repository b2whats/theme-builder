import { css } from '@emotion/css'
import { mergeTheme } from './merge'
import type { Properties } from './Properties'
import type { DeepPartial, MaybeArray, NoInfer } from './utils'
import { objectHash } from './utils'

type Exactly<T1, T2> = T2 & Record<Exclude<keyof T2, keyof T1>, `Not possible property key`>

type OrFunction<Args, Return> = (props: Args) => Return
type AddPropertyFunction<L, Props> = L extends object ? {
  [K in keyof L]?: L[K] extends Record<string, any> ? AddPropertyFunction<L[K], Props> : L[K] | OrFunction<Props, L[K] | undefined>
} : never

type AdditionalProps<Props> = {
  withProps?: boolean | ((props: Partial<Props>) => Partial<Props>)
  className?: string
}

type ChildrenBlock<C, StyleProps> = {
  children?: ChildrenProps<C, StyleProps>
}
type ChildrenProps<C, StyleProps> = {
  component?: C
} & ([C] extends [never] ? StyleProps : C extends (props: infer Props)=> void ? Partial<Props> : never) ;

type PropertyOptions<Builder, Props, ChildrenComponent> = Builder extends Properties<any, infer L, any> ? AddPropertyFunction<L, Props> extends infer PF ? PF & AdditionalProps<Props> & ChildrenBlock<ChildrenComponent, PF> : never : never
type Slot<Name extends string, List> = {
  [key in Name]: List
}

export type StyleSlots<Slots> = {
  [K in keyof Slots]: {
    className: string
  }
}

type ComponentTheme<Props> = {
  defaultProps?: Props
  mapProps?: (props: Props) => Props
  slots: {
    [key: string]: AdditionalProps<Props> & ChildrenBlock<never, {}>
  }
}
type ComponentThemeAsList<Name extends string, Props> = {
  [key in Name]?: Partial<ComponentTheme<Props>>
}
export class Component<Name extends string = never, Props = never, Slots extends Record<string, any> = {}, PropertiesList extends Properties<any, any> = never> {
  componentName!: string
  theme: ComponentTheme<Props> = {
    defaultProps: undefined,
    mapProps: undefined,
    slots: {},
  }
  private styleCache: Map<object, Map<string, object>> = new Map()
  private cache: Map<object, object> = new Map()

  constructor(
    public properties: PropertiesList,
  ) {}

  types<P extends object>(): Component<Name, Partial<P>, Slots, PropertiesList> {
    return this as any
  }

  name<N extends string>(name: N): Component<N, Props, Slots, PropertiesList> {
    this.componentName = name

    return this 
  }
  defaultProps(props: Props) {
    this.theme.defaultProps = props

    return this
  }
  mapProps(map: (props: Props) => Props) {
    this.theme.mapProps = map

    return this
  }

  slot<
    SlotName extends string,
    Config extends PropertyOptions<PropertiesList, Props, ChildrenComponent>,
    ChildrenComponent = never
  >(name: SlotName, config: PropertyOptions<PropertiesList, Props, ChildrenComponent> ): Component<Name, Props, Slots & Slot<SlotName, Config>, PropertiesList> {
    this.theme.slots[name] = config
    
    return this
  }

  objectStyleToString(tokens: DeepPartial<this['properties']['tokens']>, props: Props, rules: {}): string {
    let css = ''

    const responsive: string[] = []
    for (const rule in rules) {
      let value = rules[rule]
      const type = typeof value

      if (type === 'function') {
        value = value(props)
      }

      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          if (index === 0) {
            css += this.properties.compute(rule, value[index], tokens)
          } else {
            responsive[index - 1] = (responsive[index - 1] || '') + this.properties.compute(rule, value[index], tokens)
          }
        }
        continue
      }

      if (type === 'object') {
        value = this.objectStyleToString(tokens, props, value)
      }

      css += this.properties.compute(rule, value, tokens)
    }

    if (responsive.length) {
      const responsiveRules = this.properties.breakpointsRules(tokens)

      for (let index = 0; index < responsive.length; index++) {
        css += responsive[index] !== '' ? `${responsiveRules[index]} {${responsive[index]}}` : ''
      }
    }

    return css
  }

  mergeTheme(theme: Record<string, any>) {
    let themeCache = this.cache.get(theme)

    if (themeCache === undefined) {
      const componentTheme = {
        ...this.properties.tokens,
        [this.componentName]: this.theme
      }
      themeCache = mergeTheme(componentTheme, theme)
      this.cache.set(theme, themeCache)
    }

    return themeCache
  }

  execute(theme: ComponentThemeAsList<Name, Props> & DeepPartial<this['properties']['tokens']>, props: Props): StyleSlots<Slots> {
    let styleCache = this.styleCache.get(theme)

    if (styleCache === undefined) {
      styleCache = new Map()
      this.styleCache.set(theme, styleCache)
    }

    const propsHash = objectHash(props)
    let propsCache = styleCache.get(propsHash)

    if (propsCache) return propsCache as StyleSlots<Slots>

    const cacheTheme = this.mergeTheme(theme) as DeepPartial<this['properties']['tokens']>
    const componentTheme = cacheTheme[this.componentName] as this['theme'] 

    props = {
      ...componentTheme.defaultProps,
      ...props,
    }

    if (componentTheme.mapProps) Object.assign(props, componentTheme.mapProps(props))

    const result: Record<string, object> = {}
    
    for (let [name, { withProps, className, children: { component, ...componentProps } = { component: undefined }, ...rules }] of Object.entries(componentTheme.slots)) {
      if (withProps) {
        Object.assign(rules, typeof withProps === 'function' ? withProps(props) : props)
      }

      result[name] = {
        className: (className ? className + ' ' : '') + css(this.objectStyleToString(cacheTheme, props, rules)),
        component,
        componentProps,
      }
    }

    styleCache.set(propsHash, result)
    return result as any
  }
}

type SwitchMap<Props, Prop extends keyof Props, Result> = {
  [Value in Extract<Props[Prop], string>]?: Result | ((props: Props) => Result | undefined)
}
interface SlotUtils {
  if<ExternalProps extends Record<string, any>, Props extends keyof ExternalProps, Values>(
    prop: MaybeArray<Props>,
    value: NoInfer<Values>,
    defaultValue?: NoInfer<Values>,
  ): (props: ExternalProps) => Values
  map<ExternalProps, Prop extends keyof ExternalProps, Values>(
    prop: Prop,
    body: SwitchMap<ExternalProps, Prop, Values>,
    defaultValue?: NoInfer<Values>,
  ): (props: ExternalProps) => Values
}

export const utils: SlotUtils = {
  if: (keys, value, defaultValue) => {
    return (props: any): any => {
      const isValue = Array.isArray(keys)
        ? keys.every(key => !!props[key])
        : props[keys]
      
      return isValue ? value : defaultValue
    }
  },
  map: (prop, options, defaultValue) => {
    return (props: any) => {
      const value = props[prop]

      return (typeof options[value] === 'function' ? options[value](props) : options[value]) || defaultValue
    }
  },
}



