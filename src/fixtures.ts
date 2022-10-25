/* eslint-disabled */

import { Tokens } from './Tokens'
import { Properties } from './Properties'
import { Component } from './Component'
import React from 'react'

export const tokens = new Tokens({
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  text: {
    h1: {
      fontSize: 12,
      lineHeight: 1.5
    },
    h2: {
      fontSize: 15,
      lineHeight: 1.7
    }
  },
  font: {
    fontSize: {
      xxxxxl: 0,
      xxxxl: 0,
      xxxl: 0,
      xxl: 36,
      xl: 26,
      l: 22,
      m: 16,
      s: 13,
      xs: 11,
    },

    lineHeight: {
      none: 1.12,
      normal: 1.375,
      dense: 1.25,
    },
  },
  palette: {
    blue50:  '#E6F6FF',
    blue100: '#CCECFF',
    blue200: '#A1DFFF',
    blue300: '#80D4FF',

    green50:  '#EEF7DC',
    green100: '#EEF7DC',
    green200: '#CBE792',
    green300: '#C1E27E',

    red50:  '#FFEDEE',
    red100: '#FFE6E6',
    red200: '#FFC5C6',
    red300: '#FFACAD',

    yellow50:  '#fff9ec',
    yellow100: '#fff3d9',
    yellow200: '#ffe5b2',
    yellow300: '#ffd173',

    purple50:  '#F3EDFE',
    purple100: '#F0E7FE',
    purple200: '#DAC5FB',
    purple300: '#CAACFA',

    orange50:  '#FFF5E2',
    orange100: '#FFE7BA',
    orange200: '#FFD78F',
    orange300: '#FFE27A',

    gray4:  '#F5F5F5',
    gray8:  '#EBEBEB',
    gray12: '#E0E0E0',
    gray16: '#D6D6D6',
    gray96: '#0a0a0a',

    black:   'rgba(0, 0, 0, 1)',
    black4:  'rgba(0, 0, 0, 0.04)',
    black8:  'rgba(0, 0, 0, 0.08)',
    black12: 'rgba(0, 0, 0, 0.12)',

    white: '#FFFFFF',
  },
  dimension: {
    rowHeight: {
      l: 48,
      m: 36,
      s: 28,
    },
    borderRadius: {
      l: 5,
      m: 3,
      s: 1,
    },
  },
  opacity: {
    minLevel: 0,
    op1: 1,
  },
  space: {
    xxxl: 40,
    xxl: 32,
    xl: 24,
    l: 20,
    m: 16,
    s: 12,
    xs: 8,
    xxs: 4,
    xxxs: 2,
  },

  // TODO: Слетели типы, ключи представлены как строки
  shadow: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  },

  zIndex: {
    tooltip: 1,
    popup: 1,
    dropdown: 1,
  },

  transition: {
    fade: ''
  },

  breakpoints: ['40em', '52em', '64em', '80em']
})

export const properties = new Properties(tokens)
  .breakpoints({
    token: 'breakpoints',
    media: (value) => `@media screen and (min-width: ${value})`
  })
  .add('grow', {
    additionalValues: [Boolean],
    cssText: (value) => `flex-grow: ${value ? 1 : 0};`
  })
  .add('display', {
    additionalValues: ['block', 'flex', 'inline'],
    cssText: (value) => `display: ${value};`
  })
  .add('fontFamily', {
    additionalValues: [String],
    cssText: (value) => `font-family: ${value};`
  })
  .add('text', {
    token: 'text',
    tokenType: 'single',
    cssText: (value) => `
      font-size: ${value.fontSize}px;
      line-height: ${value.lineHeight};
    `
  })
  .add('fontSize', {
    token: 'font.fontSize',
    additionalValues: [String],
    cssText: (value) => `font-size: ${value}px;`
  })
  .add('lineHeight', {
    token: 'font.lineHeight',
    cssText: (value) => `line-height: ${value};`
  })
  .add('italic', {
    additionalValues: [Boolean],
    cssText: (value) => `font-style: ${value ? 'italic' : 'normal'};`
  })
  .add('noWrap', {
    additionalValues: [Boolean],
    cssText: (value) => `white-space: ${value ? 'nowrap' : 'normal'};`
  })
  .add('pre', {
    additionalValues: [Boolean],
    cssText: (value) => `white-space: ${value ? 'pre-wrap' : 'normal'};`
  })
  .add('uppercase', {
    additionalValues: [Boolean],
    cssText: (value) => `text-transform: ${value ? 'uppercase' : 'none'};`
  })
  .add('cursor', {
    additionalValues: [String],
    cssText: (value) => `cursor: ${value};`,
  })
  .add('smoothing', {
    additionalValues: ['auto', 'antialiased', 'subpixel'],
    cssText: (value) => {
      const webkitSmoothing = { auto: 'auto', antialiased: 'antialiased', subpixel: 'subpixel-antialiased' }
      const mozSmoothing = { auto: 'auto', antialiased: 'grayscale', subpixel: 'grayscale' }

      return `
        -webkit-font-smoothing: ${webkitSmoothing[value]};
        -moz-osx-font-smoothing: ${mozSmoothing[value]};
      `
    }
  })
  .add('shrink', {
    additionalValues: [Boolean],
    cssText: (value) => `flex-shrink: ${value ? '1' : '0'};`
  })
  .add('borderRadius', {
    token: 'dimension.borderRadius',
    additionalValues: ['circle', Number],
    cssText: (value) => `border-radius: ${value === 'circle' ? '100' : value}px;`
  })
  .add('column', {
    additionalValues: [Boolean],
    cssText: (value) => `flex-direction: ${value ? 'column' : 'row'};`
  })
  .add('color', {
    token: 'palette', 
    cssText: (value) => `color: ${value};`
  })
  .add('bg', {
    token: 'palette', 
    cssText: (value) => `background-color: ${value};`
  })
  .add('opacity', {
    token: 'opacity', 
    cssText: (value) => `opacity: ${value};`
  })
  .add('colorHEX', {
    token: 'palette',
    additionalValues: [String],
    cssText: (value) => `color: ${value};`
  })
  .add('shadow', {
    token: 'shadow',
    additionalValues: [String],
    cssText: (value) => `box-shadow: ${value};`
  })
  .add('height', {
    token: 'dimension.rowHeight',
    additionalValues: [Number],
    cssText: (value) => `height: ${value}px;`
  })
  .add('focus', {
    token: 'focus',
    cssText: (value) =>  value ? `
      &&:focus{
        box-shadow: ${value};
        position: relative;
        z-index: 2;
      }
    ` : ''
  })
  .complexSelectors({
    hover: (rules) => `&&:hover{${rules}}`,
    active: (rules) => `&&&:active{${rules}}`,
    disabled: (rules) => `&&&&:disabled{${rules}}`,
  })

const a = properties.list()['height']
// properties.compute('fontSize', 's', tokens.scheme)
type Props = {
  /** Размер */
  size?: 's' | 'm' | 'l'
  kind?: 'fill' | 'outline'
}

type Props2 = {
  kind2: 'fill' | 'outline',
  kind3: 'fill' | 'outline'
}

const A = React.createElement('div')
const C = (props: Props2) => A
const C1 = (props: Props2) => A

export const component = new Component(properties)
  .name('Button')
  .types<Props>()
  .defaultProps({
    size: 's',
  })
  .mapProps((props) => ({
    size: 'm',
  }))
  .slot('base', {
    asString: 'color: red;',
    display: (props) => 'block',
    color: ['black', 'blue50'],
    fontSize: 'xxl',
    hover: {
      grow: [true, false]
    },
    '&::before': {
      color: ['black', 'blue50'],
    }
  })
  .slot('base2', {
    asString: `color: red;`,
    color: ['black4', 'black4'],
    display: props => 'inline',
    hover: {
      disabled: {
        display: ['inline'],
        color: ['black4', 'red50'],
        fontSize: (props) => 'm',
      }
    },
    children: {
      component: (props: Props) => props.size === 'm' ? C1 : C,
      kind2: 'fill',
      // component: C,
      // kind2: 'fill',
      // kind2: (p) => 'fill',
      //color: 'black12',
    }
  })