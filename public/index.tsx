import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button/Button';
import { ThemeProvider } from '../src/theming'
import { theme } from './theme'

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Button size='l' mx='s'>"HELLO REACT"</Button>
    </ThemeProvider>
, document.getElementById('root'));