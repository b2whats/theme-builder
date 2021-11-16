import { Tokens } from './Tokens'
import { Properties } from './Properties'
import { Component } from './Component'

export const tokens = new Tokens({
  focus: '0px 0px 2px 3px black',
  breakpoints: ['70em', '50em', '30em'],
  shadow: {
    1: '0px 1px 2px black',
    2: '3px 4px 5px black',
  },
  font: {
    fontSize: {
      l: 15,
      m: 13,
      s: 11,
    },
  },
  palette: {
    red:  '#FFEDEE',
    blue: '#FFE6E6',
    green: '#FFC5C6',
    primary: 'blue'
  },
})


export const properties = new Properties(tokens)
  .breakpoints({
    token: 'breakpoints'
  })
  .add('display', {
    toString: (value: 'block' | 'flex' | 'inline') => `display: ${value};`
  })
  .add('color', {
    token: 'palette', 
    toString: (value: string) => `color: ${value};`
  })
  .add('fontSize', {
    token: 'font.fontSize',
    toString: (value) => `font-size: ${value}px;`
  })
  .add('shadow', {
    token: 'shadow',
    toString: (value) => `box-shadow: ${value};`
  })
  .add('focus', {
    token: 'focus',
    toString: (value) =>  value ? `
      &&:focus{
        box-shadow: ${value};
        position: relative;
        z-index: 2;
      }
    ` : ''
  })
  .states({
    hover: (rules) => `&&:hover{${rules}}`
  })
  //.list()

type Props = {
  /** Размер */
  size: 's' | 'm' | 'l'
  kind: 'fill' | 'outline'
}

export const component = new Component(properties)
  .name('Button')
  .types<Props>()
  .defaultProps({
    size: 's'
  })
  .slot('base', {
  })
  .slot('base2', {
    display: 'block',
    hover: {
      color: ['primary']
    }
  })

