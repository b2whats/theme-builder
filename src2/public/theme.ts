import { Theme } from '../theme'
import { tokens } from './tokens'
import { buttonTheme } from './Button/index'

declare module '../src/theme' {
  export interface Theme {
    Button?: typeof buttonTheme
  }
}

export const theme: Theme = {
  ...tokens,
}