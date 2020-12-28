import * as React from 'react'
import deepmerge from 'deepmerge'
import { Theme } from './theme'

type ThemeProviderProps = {
  theme: Theme,
  children: any
}

export const ThemeContext = React.createContext<Theme>({} as Theme)
export const useTheme = () => React.useContext(ThemeContext)

export const ThemeProvider = (props: ThemeProviderProps) => {
  let theme = React.useContext(ThemeContext)

  if (theme) {
    theme = props.theme
  }

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}