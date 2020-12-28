import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button/Button';
import { otherButtonTheme } from './Button/theme';
import { ThemeProvider } from '../src/theming'
import { theme } from './theme'

const otherTheme = {
  ...theme,
  Button: otherButtonTheme
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Button size='l' mx='s'>"HELLO REACT"</Button>
    <ThemeProvider theme={otherTheme}>
      <Button size='l' mx='s' m='l'>"HELLO REACT"</Button>
    </ThemeProvider>
  </ThemeProvider>
, document.getElementById('root'));