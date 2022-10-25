import React, { useRef } from 'react'
import { useStyle } from './theme'
import { ButtonProps } from './contract'
import { useElementState } from '../../src/useElementState';

class ClassComponent extends React.Component<{ CCProp?: "foo" }> {}
const FunctionComponent: React.FC<{ FCProp?: "foo" }> = () => null;

export const _ = <T,>(): T => {
  throw new Error("hole"); 
}

export const Button = ({ children, ...props }: ButtonProps) => {
  const Box = useStyle(props)
  const ref = useRef(null)
  const phase = useElementState(ref, ['hover','focus', 'press'])

  const onClick = () => { console.log('click') }
  const conditional = true
console.log('render')

const A = () => <div>123</div>

// Добавить к чилдренам функцию
  return (
    <Box ref={ref} slot='base' as={props.href ? 'a' : 'button'} href={props.href} onClick={onClick}>
        {children}
        <Box as='span' slot='showPassword' children={_()} />
        <Box slot='base' parentPhase={phase}>
          {(phase) => <div data-phase={phase}>{phase}</div>}
        </Box>
        <Box as='span' slot='base'>
          sib 
        </Box>
        <Box slot='showPassword'>
          {(ThemeChildren) => <ThemeChildren />}
        </Box>
        <Box slot='base' />
        <Box as={props.href ? 'a' : 'button'} slot='showPassword' parentPhase={phase} name=''>
          {(ThemeChildren) => conditional ? <ThemeChildren /> : props.iconBefore}
        </Box>
        <Box as={props.href ? 'a' : 'button'} slot='showPassword' >
          {(ThemeChildren) => null}
        </Box>
        <Box slot='base' parentPhase={phase}>
          {(phase) => <div/>}
        </Box>
        <Box slot='base' parentPhase={phase}>
          {props.iconAfter}
        </Box>
        <Box slot='base'>
          <FunctionComponent />
        </Box>
    </Box>
  )
}

