// @ts-nocheck

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button/Button';
import { otherButtonTheme } from './Button/theme';
import { ThemeProvider } from '../theming'
import { theme } from './theme'
import { cellx, Cell } from 'cellx' 

const otherTheme = {
  Button: otherButtonTheme
}

const c1 = cellx('1')
const c2 = cellx(() => c1() + '-one')
console.log(c2())

function User() {
  this.firstName = cellx('1');
  this.lastName = cellx('2');

  this.fullName = cellx(
  () => (this.firstName() + ' || ' + this.lastName()).trim(),
  {
    put: (_, name) => {
      name = name.split(' ');

      this.firstName(name[0]);
      this.lastName(name[1]);
    }
  }
);
}

let user = new User();

console.log('get', user.fullName())
console.log(user.fullName('Matroskin Cat'))

console.log(user.firstName());
// => 'Matroskin'
console.log(user.lastName());
// => 'Cat'

function get(fn) {
  return {
    get: (value) => value === null ? '' : fn(value)
  }
}

function createCell(fn) {
  return cellx(null, {
    get: (value) => value === null ? '' : fn(value)
  })
}

function Style() {
  this.display = cellx('')
  this.display2 = cellx('')
  this.grow = createCell((value) => {
      console.log('get grow', value)
      return value + this.display() + this.display2()
    }
  )
  this.computed = cellx(() => {
    console.log('computed')
    return [this.grow()].join()
  })
}

function test() {
  this.display = cellx('')
  this.display2 = cellx('')
}

const style = new Style()
console.log('start')
style.computed.subscribe(() => console.log('subscribe', style.computed()))
console.log('after onChange')
style.grow(11)
// style.grow(true)
// //console.log('computed', style.computed())
// style.display('block')
// style.display2('block2')
// console.log('computed', style.computed())
// style.display2('block3')

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Button size='l' mx='s'>"HELLO REACT"</Button>
    <ThemeProvider theme={otherTheme}>
      <Button width={1} size={['l', 's', 'm', 'l']} mx={['s', 'm', 'l']}>"HELLO REACT"</Button>
    </ThemeProvider>
  </ThemeProvider>
, document.getElementById('root'));