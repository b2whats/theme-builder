import { css } from '@emotion/css'
import { mergeTheme } from './merge'
import type { Properties } from './Properties'
import type { DeepPartial, MaybeArray, NoInfer, ComponentType } from './utils'
import { objectHash, isEmptyObject } from './utils'

type OrFunction<Args, Return> = (props: Args) => Return
type AddPropertyFunction<L, Props> = {
  [K in keyof L]?: L[K] extends Record<string, any> ? AddPropertyFunction<L[K], Props> : L[K] | OrFunction<Props, L[K]>
}

type AdditionalProps<Props> = {
  withProps?: boolean | ((props: Props) => Partial<Props>)
  className?: string
  asString?: string
}

type SimpleComponent<P = any> = ComponentType<P, JSX.Element>
type CurryComponent<C = any, P = any> = (cond: C) => SimpleComponent<P>
type ChildrenBlock<ChildrenProps, StyleProps, Props> = {
  children?: {
    component?: CurryComponent<Props, ChildrenProps> | SimpleComponent<ChildrenProps>
  } & (ChildrenProps extends object ? AddPropertyFunction<ChildrenProps, Props> : Partial<StyleProps>)
}

type Flatten<T> = T extends unknown ? T : never

type PropertyConfig<List, Props, ChildrenProps> = List extends Properties<any, infer L, any> ? AddPropertyFunction<L, Props> & AdditionalProps<Props> & ChildrenBlock<ChildrenProps, L, Props> : never
type Slot<Name extends string, List> = {
  [key in Name]: List
}

export type StyleSlots<Slots> = {
  [K in keyof Slots]: {
    className: string,
    children: Slots[K] extends { children: { component: infer C, [key: string]: any } }
      ? C extends CurryComponent ? ReturnType<C> : C
      : undefined
    childrenProps:  Slots[K] extends { children: infer C } ? Flatten<Pick<C, Exclude<keyof C, 'component'>>> : undefined,
  }
}

type NonArrayObject = {
  [x: string]: any
  [y: number]: never
}

type Validate<T, U> = U & {
  [K in keyof T]: K extends Extract<keyof T, keyof U>
    ? (T[K] extends NonArrayObject ? Validate<T[K], NonNullable<U[K]>> : T[K])
    : `Not possible property key - ${K & string}`
}

type ComponentTheme<Props> = {
  defaultProps?: Partial<Props>
  mapProps?: (props: Props) => Partial<Props>
  slots: {
    [key: string]: AdditionalProps<Props> & ChildrenBlock<any, {}, any>
  }
}
type ComponentThemeAsList<Name extends string, Props> = {
  [key in Name]?: Partial<ComponentTheme<Props>>
}
export class Component<
  Name extends string = never,
  Props = never,
  Slots extends Record<string, any> = {},
  PropertiesList extends Properties<any, any> = never
> {
  componentName!: string
  theme: ComponentTheme<Props> = {
    defaultProps: undefined,
    mapProps: undefined,
    slots: {},
  }
  private styleCache: Map<object, Map<string, object>> = new Map()
  private cache: Map<object, object> = new Map()

  constructor(public properties: PropertiesList) {}

  types<P extends Record<string, any>>(): Component<Name, P, Slots, PropertiesList> {
    return this as any
  }

  name<N extends string>(name: N): Component<N, Props, Slots, PropertiesList> {
    this.componentName = name

    return this 
  }

  defaultProps(props: Partial<Props>) {
    this.theme.defaultProps = props

    return this
  }

  mapProps(map: (props: Props) => Partial<Props>) {
    this.theme.mapProps = map

    return this
  }

  slot<
    SlotName extends string,
    Config,
    ChildrenProps,
  >(
    name: SlotName,
    config: Validate<Config, PropertyConfig<PropertiesList, Props, ChildrenProps>>
  ): Component<Name, Props, Slots & Slot<SlotName, Config>, PropertiesList> {
    this.theme.slots[name] = config
    
    return this
  }

  objectStyleToString(tokens: DeepPartial<this['properties']['tokens']>, props: Props, rules: {}): string {
    let css = ''
    const responsiveCss: string[] = []

    if (rules['asString']) {
      css += rules['asString']
    }

    for (const rule in rules) {
      let value = rules[rule]
      const type = typeof value

      if (!this.properties.rules[rule]) continue

      if (type === 'function') {
        value = value(props)
      }

      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          responsiveCss[index] = this.properties.compute(rule, value[index], tokens)
        }
        continue
      }

      if (type === 'object') {
        value = this.objectStyleToString(tokens, props, value)
      }

      css += this.properties.compute(rule, value, tokens)
    }

    if (responsiveCss.length) {
      const responsiveRules = this.properties.breakpointsRule(tokens)
      css += responsiveCss[0]

      for (let index = 1; index < responsiveCss.length; index++) {
        css += responsiveCss[index] !== '' ? `${responsiveRules[index]} {${responsiveCss[index]}}` : ''
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

    console.log('execute')

    const cacheTheme = this.mergeTheme(theme) as DeepPartial<this['properties']['tokens']>
    const componentTheme = cacheTheme[this.componentName] as this['theme'] 

    props = {
      ...componentTheme.defaultProps,
      ...props,
    }

    if (componentTheme.mapProps) Object.assign(props, componentTheme.mapProps(props))

    const result  = {} as StyleSlots<Slots>
    
    for (let [name, { withProps, className, children: { component, ...childrenProps } = { component: undefined }, ...rules }] of Object.entries(componentTheme.slots)) {
      if (withProps) {
        Object.assign(rules, typeof withProps === 'function' ? withProps(props) : props)
      }

      result[name as keyof Slots] = {
        className: (className ? className + ' ' : '') + css(this.objectStyleToString(cacheTheme, props, rules)),
        children: component,
        childrenProps: isEmptyObject(childrenProps) ? undefined : childrenProps,
      } as any
    }

    styleCache.set(propsHash, result)
    return result
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
    return function utils(props: any): any {
      const isValue = Array.isArray(keys)
        ? keys.every(key => !!props[key])
        : props[keys]
      
      return isValue ? value : defaultValue
    }
  },
  map: (prop, options, defaultValue) => {
    return function utils(props: any) {
      const value = props[prop]

      return (typeof options[value] === 'function' ? options[value](props) : options[value]) || defaultValue
    }
  },
}


