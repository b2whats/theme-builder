import React, { useRef, useCallback } from 'react'
import type { Component, StyleSlots } from './Component'
import type { Properties } from './Properties'
import type { FlattenType } from './utils'

type AsList = React.ElementType

type SlotProps<Name, As extends AsList, T> = {
  name: Name
  as?: As
  children?: React.ReactNode
  test: T
} & Omit<React.ComponentProps<As>, never>

export function createHook<Props, Slots, PropertiesList extends Properties<any, any, any>>(component: Component<any, Props, Slots, PropertiesList>) {
  return (theme: typeof component['properties']['tokens'], props: Props) => {
    const slots = useRef<StyleSlots<Slots>>()
    slots.current = component.execute(theme, props)

    const Slot = useCallback(<T extends AsList, Name extends keyof StyleSlots<Slots>>({ as, name, ...props}: FlattenType<SlotProps<Name, T, StyleSlots<Slots>[Name]['as']>>) => {
      const slot = slots.current![name]
      const As = as || 'div'

      return React.createElement(As, props)
    }, [])

    return Slot
  }
}