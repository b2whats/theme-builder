import React, { useRef } from 'react'
import { component } from './fixtures'
import { createHook } from './createHook'


const useStyle = createHook(component)

const test = {
  
}
const Slot = useStyle(test as any, {})

const C = () => {
  const r = useRef<any>()
  return <Slot ref={r} name='base' test='kk' as='a' className='ddf'  href='ffff'/>
}