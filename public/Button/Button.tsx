import React, { useRef } from 'react'
import { useStyle } from './theme'
import { ButtonProps } from './contract'

class ClassComponent extends React.Component<{ CCProp: "foo" }> {}
const FunctionComponent: React.FC<{ FCProp: "foo" }> = () => null;

export const Button = ({ children, ...props }: ButtonProps) => {
  const Box = useStyle(props)
  const ref = useRef(null)
  const onClick = () => { console.log('click') }

  return (
    <Box ref={ref} slot='base' as={'a'} href='ddd' events={['focus']}>
      {(aaa) => ''}
      {/* {(states) => 'aaa'} */}
      {/* {children} */}
      {/* {(state) => (children + JSON.stringify(state))} */}
      {/* {props.iconBefore && <Box slot='before'>{props.iconBefore}</Box>} */}
    </Box>
  )
}
// forwardref в Box