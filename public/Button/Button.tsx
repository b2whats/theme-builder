import React, { useRef } from 'react'
import { useStyle } from './theme'
import { ButtonProps } from './contract'

class ClassComponent extends React.Component<{ CCProp: "foo" }> {}
const FunctionComponent: React.FC<{ FCProp: "foo" }> = () => null;

export const Button = ({ children, ...props }: ButtonProps) => {
  const Box = useStyle(props)
  const ref = useRef(null)
  console.log(ref)
  const onClick = () => { console.log('click') }

  return (
    <Box ref={ref} slot='base' as={props.href ? 'a' : 'button'} href={props.href} events={['hover','focus']}>
      {(state) => <>
        {children}
        {JSON.stringify(state)}
        <Box as='span' slot='before'>
          {props.iconBefore}
        </Box>
      </>}

    </Box>
  )
}
// forwardref в Box