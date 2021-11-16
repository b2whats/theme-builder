import type { Properties } from './Properties'
import type { FlattenObjectType } from './utils'

type OrFunction<Args, Return> = (props: Args) => Return

type AddPropertyFunction<L, Props> = L extends object ? {
  [K in keyof L]?: L[K] extends Record<string, any> ? AddPropertyFunction<L[K], Props> :  L[K] | OrFunction<Props, L[K]>
} : never

type GetPropertyTypes<P, Props> = P extends Properties<any, infer L, any> ? AddPropertyFunction<L, Props> : never
type Slot<Name extends string, List> = {
  [key in Name]: List
}

export class Component<Name = never, Props = never, Slots = {}, PropertiesList extends Properties<any> = never> {
  theme: {
    name: string
    defaultProps: Partial<Props>
    mapProps: (props: Props) => Partial<Props>
    slots: Record<string, object>
  } 

  constructor(
    readonly properties: PropertiesList
  ) {
    this.theme = {
      name: '',
      defaultProps: {},
      mapProps: () => ({}),
      slots: {},

    }
  }

  types<P extends object>(): Component<Name, P, Slots, PropertiesList> {
    return this as any
  }

  name<N extends string>(name: N): Component<N, Props, Slots, PropertiesList> {
    this.theme.name = name

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
  >(name: SlotName, config: GetPropertyTypes<PropertiesList, Props>): Component<Name, Props, FlattenObjectType<Slots & Slot<SlotName, typeof config>>, PropertiesList> {
    return this
  }
}