import * as React from 'react'
import { Theme } from './theme'
import { mergeTheme } from './mergeTheme'

type ThemeProviderProps = {
  theme?: Theme,
  children: any
}

export const ThemeContext = React.createContext<Theme>({} as Theme)
export const useTheme = () => React.useContext(ThemeContext)

export const ThemeProvider = (props: ThemeProviderProps) => {
  let theme = React.useContext(ThemeContext)

  if (theme !== props.theme) {
    theme = mergeTheme(theme, props.theme)
  }

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}