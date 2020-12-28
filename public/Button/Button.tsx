import React from 'react'
import { useTheme } from '../../src/theming'
import { ButtonProps } from './contract'
import { buttonTheme } from './theme'

export const Button = ({ children, ...props }: ButtonProps) => {
  const theme = useTheme()

  const { Button } = buttonTheme.merge(theme.Button).compute(props, theme)

  return (
    <button className={Button.className}>{children}</button>
  )
}