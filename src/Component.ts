import { css } from '@emotion/css'
import { mergeTheme } from './merge'
import type { Properties } from './Properties'
import type { FlattenObjectType, DeepPartial, Tags } from './utils'
import { objectHash } from './utils'

type OrFunction<Args, Return> = (props: Required<Args>) => Return
type MaybeArray<T> = T[] | T
type MaybeFunction<T, Props> = ((props: Props) => T) | T
type AddPropertyFunction<L, Props> = L extends object ? {
  [K in keyof L]?: L[K] extends Record<string, any> ? AddPropertyFunction<L[K], Props> : L[K] | OrFunction<Props, L[K]>
} : never

type As<Props = unknown> = {
  as?: unknown extends Props ? Tags : MaybeFunction<Tags, Props>
}
type AdditionalProps<Props> = {
  withProps?: boolean | ((props: Partial<Props>) => Partial<Props>)
} & As<Props>

type GetPropertyTypes<P, Props> = P extends Properties<any, infer L, any> ? AddPropertyFunction<L, Props> : never
type Slot<Name extends string, List> = {
  [key in Name]: List
}
export type StyleSlots<Slots> = {
  [K in keyof Slots]: {
    as: Slots[K] extends Record<string, any> ? Slots[K]['as'] extends (p: any) => any ? ReturnType<Slots[K]['as']> : Slots[K]['as'] : Tags // Переписать, случайный структурный тип
    className: string
  }
}

type ComponentTheme<Props> = {
  defaultProps?: Props
  mapProps?: (props: Props) => Props
  slots: {
    [key: string]: AdditionalProps<Props>
  }
}
type ComponentThemeAsList<Name extends string, Props> = {
  [key in Name]?: Partial<ComponentTheme<Props>>
}

type PartialProps<Props> = {
  [P in keyof Props]?: Props[P] | undefined
} & As

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

  types<P extends object>(): Component<Name, PartialProps<P>, Slots, PropertiesList> {
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

  // FlattenObjectType на Slots создает бесконечную рекурсию
  slot<
    SlotName extends string,
    Config extends GetPropertyTypes<PropertiesList, Props> & AdditionalProps<Props>
  >(name: SlotName, config: Config & GetPropertyTypes<PropertiesList, Props> & AdditionalProps<Props>): Component<Name, Props, Slots & Slot<SlotName, Config>, PropertiesList> {
    this.theme.slots[name] = config
    
    return this
  }

  slot2<
    Config extends { length: number, l: string }
  >(config: Config) {

    
    return this as any
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

  mergeTheme<
    Theme extends ComponentThemeAsList<Name, Props> & DeepPartial<this['properties']['tokens']>
  >(theme: Theme) {
    let themeCache = this.cache.get(theme)

    if (themeCache === undefined) {
      const componentTheme = {
        ...this.properties.tokens,
        [this.componentName]: this.theme
      }
      themeCache = mergeTheme(componentTheme, theme)
      this.cache.set(theme, themeCache)
    }

    return themeCache as Theme
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
    
    for (let [name, { as, withProps, ...rules }] of Object.entries(componentTheme.slots)) {
      if (withProps) {
        Object.assign(rules, typeof withProps === 'function' ? withProps(props) : props)
      }

      result[name] = {
        as: typeof as === 'function' ? as(props) : as,
        className: css(this.objectStyleToString(cacheTheme, props, rules)),
      }
    }

    styleCache.set(propsHash, result)
    return result as any
  }
}