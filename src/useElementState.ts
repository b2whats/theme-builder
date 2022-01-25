import { cellx } from 'cellx'
import { useEffect, useRef } from 'react'
import { debounce } from './utils'

export type Phase = 'normal' | 'hover' | 'press' | 'focus'

class StatesHandler {
  phase = cellx<Phase>('normal')
  stack = new Set<Phase>(['normal'])

  constructor() {
   this.update = debounce(this.update.bind(this), 64)
  }

  handleEvent(event: MouseEvent | FocusEvent) {
    switch (event.type) {
      case 'mouseenter': this.stack.add('hover'); break
      case 'mouseleave': this.stack.delete('hover'); break
      case 'mousedown': this.stack.add('press'); break
      case 'mouseup': this.stack.delete('press'); break
      case 'focus': this.stack.add('focus'); break
      case 'blur':  this.stack.delete('focus'); break
      default: break
    }

    this.update(Array.from(this.stack).pop()!)
  }

  update(value: Phase) {
    console.log('update phase')
    this.phase(value)
  }
}

type PhaseList = ('press' | 'hover' | 'focus')[]

export const useElementState = (ref: React.RefObject<HTMLElement>, phases: PhaseList = []) => {
  const { current: handler } = useRef(new StatesHandler())

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

  return handler.phase
}