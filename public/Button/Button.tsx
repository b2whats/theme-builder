import React from 'react'
import { useTheme } from '../../src/theming'
import { ButtonProps } from './contract'
import { buttonTheme } from './theme'

export const Button = ({ children, ...props }: ButtonProps) => {
  const theme = useTheme()

  const { Button, Text } = buttonTheme.merge(theme.Button).compute(theme)(props)

  return (
    <Button.type className={Button.className}>{children}</Button.type>
  )
}