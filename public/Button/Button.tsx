import React from 'react'
import { useStyle } from './theme'
import { ButtonProps } from './contract'

export const Button = ({ children, ...props }: ButtonProps) => {
  const Box = useStyle(props)
  const onClick = () => { console.log('click') }

  return (
    <Box slot='base' as='button' href={props.href} onClick={onClick}>
      {props.iconBefore && <Box slot='before'>{props.iconBefore}</Box>}
      {children}
    </Box>
  )
}
// forwardref в Box