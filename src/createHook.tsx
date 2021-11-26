import React, { useRef, useCallback } from 'react'
import type { Component, StyleSlots } from './Component'
import type { Properties } from './Properties'
import type { Tags } from './utils'

type OmitUnion<U> = U extends any ? Omit<U, never> : never
type Join<T, U> = T & (U extends any ? Omit<U, keyof T> : T)
type SlotProps<Name, As extends Tags, AsStyle extends Tags> = Join<{
  slot: Name
  as?: As
  children?: React.ReactNode
}, ([As] extends [never]
  ? [unknown] extends [AsStyle]
    ? JSX.IntrinsicElements['div']
    : JSX.IntrinsicElements[AsStyle]
  : JSX.IntrinsicElements[As]
)>

const theme = {}

export function createHook<Props, Slots, PropertiesList extends Properties<any, any, any>>(component: Component<any, Props, Slots, PropertiesList>) {
  return (props: Props) => {
    const slots = useRef<StyleSlots<Slots>>()
    slots.current = component.execute({} as any, props)

    const Slot = useCallback(<Name extends keyof StyleSlots<Slots>, T extends Tags = never>({ as, slot, ...props}: SlotProps<Name, T,  StyleSlots<Slots>[Name]['as']>) => {
      const slotProps = slots.current![slot]
      const As = as || slotProps.as || 'div'

      return React.createElement(As, {...props, className: slotProps.className })
    }, [])

    return Slot
  }
}