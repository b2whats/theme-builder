import React, { useRef, useCallback, useReducer, useEffect, Children } from 'react'
import { useMergeRefs } from './useMergeRefs'
import type { Component, StyleSlots } from './Component'
import type { Properties } from './Properties'

type AsType = 
  | keyof JSX.IntrinsicElements
  | React.FunctionComponent<any>
  | React.ComponentClass<any>

type Join<L, R> = R & (L extends any ? Omit<L, keyof R> : never)

type BoxProps<As, Name, Element, Events> = Join<(
  [Element] extends [React.FunctionComponent<infer FProps>] ? FProps & {} :
  [Element] extends [React.ComponentClass<infer CProps, any>] ? CProps & {} :
  Element extends React.DetailedHTMLProps<infer A, infer B> ? React.DetailedHTMLProps<A, B> :
  {}
), {
  as?: As,
  slot: Name,
  events?: Events,
  children?: [Events] extends [never] ?  React.ReactNode  : ((state: StatesHandlerData) => React.ReactNode)
} & ComponentProps>

type BoxComponent<Slots> = {
  <
    Name extends keyof StyleSlots<Slots>,
    As extends AsType = typeof defaultElement,
    Element = As extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[As] : As,
    Events extends PhaseList = never,
  >(props: BoxProps<As, Name, Element, Events>): any
}
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const theme = {}
const defaultElement = "div"

export function createHook<Props, Slots, PropertiesList extends Properties<any, any, any>>(component: Component<any, Props, Slots, PropertiesList>) {
  return (props: Props) => {
    const slots = useRef<StyleSlots<Slots>>()

    slots.current = component.execute(theme as any, props)

    const Box: BoxComponent<Slots> = useCallback(React.forwardRef(({ as, slot, events, children, ...props }, ref: React.Ref<Element>) => {
      if (!children) return null

      const internalRef = useRef<HTMLElement>(null)
      const slotProps = slots.current![slot]
      
      return React.createElement(
        as || defaultElement,
        Object.assign(props, { ref: useMergeRefs(internalRef, ref), className: slotProps.className }),
        typeof children === 'function'
          ? events && children(useElementState(internalRef, props, events))
          : children
      )
    }), [])

    return Box
  }
}

function debounce(func: (...args: any[]) => void, timeout = 300){
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}

type ComponentProps = {
  disabled?: boolean
  loading?: boolean
}

type Phase = 'normal' | 'hover' | 'press' | 'disabled'

type StatesHandlerData = {
  phase: Phase
  focus: boolean
  loading: boolean
}

class StatesHandler {
  state: StatesHandlerData = {
    phase: 'normal',
    focus: false,
    loading: false
  }

  stack = new Set<Phase>(['normal'])
  last: Phase = 'normal'
  update: () => void

  constructor(update: () => void) {
    this.update = debounce(update, 32)
  }

  fromProps(props: ComponentProps) {
    this.state.phase = props.disabled ? 'disabled' : this.last
    this.state.loading = props.loading ? true : false
  }

  handleEvent(event: MouseEvent | FocusEvent) {
    switch (event.type) {
      case 'mouseenter': this.stack.add('hover'); break
      case 'mouseleave': this.stack.delete('hover'); break
      case 'mousedown': this.stack.add('press'); break
      case 'mouseup': this.stack.delete('press'); break
      case 'focus': this.state.focus = true; break
      case 'blur': this.state.focus = false; break
      default: break
    }

    this.last = Array.from(this.stack).pop()!
    this.update()
  }
}

type PhaseList = ('press' | 'hover' | 'focus')[]

const useElementState = (ref: React.RefObject<HTMLElement>, props: ComponentProps, phases: PhaseList = []) => {
  const forceUpdate = useReducer(() => ({}), {})[1]
  const { current: handler } = useRef(new StatesHandler(forceUpdate))
  handler.fromProps(props)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const events = phases.reduce((acc, phase) => {
        acc.push(...{
          press: ['mousedown', 'mouseup'],
          hover: ['mouseenter', 'mouseleave'],
          focus: ['focus', 'blur'],
        }[phase])

        return acc
      }, [] as string[])

    events.forEach(event => node.addEventListener(event, handler))
    
    return () => events.forEach(event => node.removeEventListener(event, handler))
  }, [])

  return handler.state
}