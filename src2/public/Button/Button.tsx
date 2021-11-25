import React, { useCallback } from 'react'
import { useTheme } from '../../theming'
import { ButtonProps } from './contract'
import { buttonTheme } from './theme'

export const Button = ({ children, theme1, ...props }) => {
  const theme = useTheme()

  const Slot = buttonTheme.merge(theme.Button).compute(theme1)(props)

  return (
    <Slot name='base'>
      {props.before && <span className={before} >{children}</span>}
      <span className={text}>{children}</span>
      {props.after && <span className={before}>{children}</span>}
      {props.loading && <span className={loader}></span>}
    </button>
  )
}

Button theme={}
const theme = {
  Button: {
    base: {
      color: () => {}
    }
  }
}