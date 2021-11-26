import React, { useRef } from 'react'
import { component } from './fixtures'
import { createHook } from './createHook'


const useStyle = createHook(component)

const test = {
  
}
const Slot = useStyle({})

const C = () => {
  const r = useRef<any>()
  return <Slot ref={r} slot=''     href='ffff'/>
}