/* eslint-disabled */

import { Tokens } from './Tokens'
import { Properties } from './Properties'
import { ObjectPaths } from './utils'
import { Component } from './Component'
import React from 'react'

export const tokens = new Tokens({
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
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
    blue400: '#45C1FF',
    blue500: '#00AAFF',
    blue600: '#0099F7',
    blue700: '#008AED',
    blue800: '#007DEB',
    blue900: '#0075EB',

    green50:  '#EEF7DC',
    green100: '#EEF7DC',
    green200: '#CBE792',
    green300: '#C1E27E',
    green400: '#B0DA2F',
    green500: '#97CF27',
    green600: '#83C217',
    green700: '#72B50E',
    green800: '#5FA800',
    green900: '#498900',

    red50:  '#FFEDEE',
    red100: '#FFE6E6',
    red200: '#FFC5C6',
    red300: '#FFACAD',
    red400: '#FF8C8F',
    red500: '#FF6163',
    red600: '#FF4053',
    red700: '#F71B47',
    red800: '#E8003E',
    red900: '#D9013A',

    yellow50:  '#fff9ec',
    yellow100: '#fff3d9',
    yellow200: '#ffe5b2',
    yellow300: '#ffd173',
    yellow400: '#ffbc33',
    yellow500: '#ffab00',
    yellow600: '#ffa102',
    yellow700: '#e0920d',
    yellow800: '#ca840e',
    yellow900: '#a47019',

    purple50:  '#F3EDFE',
    purple100: '#F0E7FE',
    purple200: '#DAC5FB',
    purple300: '#CAACFA',
    purple400: '#B78FF9',
    purple500: '#A168F7',
    purple600: '#965EEB',
    purple700: '#8C4FE8',
    purple800: '#8144DB',
    purple900: '#493072',

    orange50:  '#FFF5E2',
    orange100: '#FFE7BA',
    orange200: '#FFD78F',
    orange300: '#FFE27A',
    orange400: '#FFD950',
    orange500: '#FFCF21',
    orange600: '#FCBD00',
    orange700: '#FFB020',
    orange800: '#FF9C18',
    orange900: '#a47019',

    gray4:  '#F5F5F5',
    gray8:  '#EBEBEB',
    gray12: '#E0E0E0',
    gray16: '#D6D6D6',
    gray20: '#CCCCCC',
    gray24: '#C2C2C2',
    gray28: '#B8B8B8',
    gray32: '#ADADAD',
    gray36: '#A3A3A3',
    gray40: '#999999',
    gray44: '#8F8F8F',
    gray48: '#858585',
    gray52: '#7a7a7a',
    gray56: '#707070',
    gray60: '#666666',
    gray64: '#5c5c5c',
    gray68: '#525252',
    gray72: '#474747',
    gray76: '#3d3d3d',
    gray80: '#333333',
    gray84: '#292929',
    gray88: '#1f1f1f',
    gray92: '#141414',
    gray96: '#0a0a0a',

    black:   'rgba(0, 0, 0, 1)',
    black4:  'rgba(0, 0, 0, 0.04)',
    black8:  'rgba(0, 0, 0, 0.08)',
    black12: 'rgba(0, 0, 0, 0.12)',
    black16: 'rgba(0, 0, 0, 0.16)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black24: 'rgba(0, 0, 0, 0.24)',
    black28: 'rgba(0, 0, 0, 0.28)',
    black32: 'rgba(0, 0, 0, 0.32)',
    black36: 'rgba(0, 0, 0, 0.36)',
    black40: 'rgba(0, 0, 0, 0.40)',
    black44: 'rgba(0, 0, 0, 0.44)',
    black48: 'rgba(0, 0, 0, 0.48)',
    black52: 'rgba(0, 0, 0, 0.52)',
    black56: 'rgba(0, 0, 0, 0.56)',
    black60: 'rgba(0, 0, 0, 0.60)',
    black64: 'rgba(0, 0, 0, 0.64)',
    black68: 'rgba(0, 0, 0, 0.68)',
    black72: 'rgba(0, 0, 0, 0.72)',
    black76: 'rgba(0, 0, 0, 0.76)',
    black80: 'rgba(0, 0, 0, 0.80)',
    black84: 'rgba(0, 0, 0, 0.84)',
    black88: 'rgba(0, 0, 0, 0.88)',
    black92: 'rgba(0, 0, 0, 0.92)',
    black96: 'rgba(0, 0, 0, 0.96)',

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

type RE = ObjectPaths<typeof tokens['scheme']>


export const properties = new Properties(tokens)
  .breakpoints({
    token: 'breakpoints',
    cssText: (value) => `@media screen and (min-width: ${value})`
  })
  .add('grow', {
    //custom: (value) => `flex-grow: ${value ? '1' : '0'};`,
    cssText: (value: 'block' | 'flex' | 'inline') => `display: ${value};`
  })
  // .add('display', {
  //   cssText: (value: 'block' | 'flex' | 'inline') => `display: ${value};`
  // })
  // .add('fontFamily', {
  //   cssText: (value: string) => `font-family: ${value};`
  // })
  .add('fontSize', {
    token: 'font',
    tokenType: 'single',
    cssText: (value: string) => `font-size: ${value}px;`
  })
  // .add('lineHeight', {
  //   token: 'font.lineHeight',
  //   cssText: (value) => `line-height: ${value};`
  // })
  // .add('italic', {
  //   cssText: (value: boolean) => `font-style: ${value ? 'italic' : 'normal'};`
  // })
  // .add('noWrap', {
  //   cssText: (value: boolean) => `white-space: ${value ? 'nowrap' : 'normal'};`
  // })
  // .add('pre', {
  //   cssText: (value: boolean) => `white-space: ${value ? 'pre-wrap' : 'normal'};`
  // })
  // .add('uppercase', {
  //   cssText: (value: boolean) => `text-transform: ${value ? 'uppercase' : 'none'};`
  // })
  // .add('cursor', {
  //   cssText: (value: string) => `cursor: ${value};`,
  // })
  // .add('smoothing', {
  //   cssText: (value: 'auto' | 'antialiased' | 'subpixel') => {
  //     const webkitSmoothing = { auto: 'auto', antialiased: 'antialiased', subpixel: 'subpixel-antialiased' }
  //     const mozSmoothing = { auto: 'auto', antialiased: 'grayscale', subpixel: 'grayscale' }

  //     return `
  //       -webkit-font-smoothing: ${webkitSmoothing[value]};
  //       -moz-osx-font-smoothing: ${mozSmoothing[value]};
  //     `
  //   }
  // })
  // .add('shrink', {
  //   cssText: (value) => `flex-shrink: ${value ? '1' : '0'};`
  // })
  // .add('borderRadius', {
  //   token: 'dimension.borderRadius',
  //   cssText: (value: 'circle' | number) => `border-radius: ${value === 'circle' ? '100' : value}px;`
  // })
  // .add('column', {
  //   cssText: (value: boolean) => `flex-direction: ${value ? 'column' : 'row'};`
  // })
  // .add('color', {
  //   token: 'palette', 
  //   cssText: (value) => `color: ${value};`
  // })
  // .add('bg', {
  //   token: 'palette', 
  //   cssText: (value) => `background-color: ${value};`
  // })
  // .add('opacity', {
  //   token: 'opacity', 
  //   cssText: (value) => `opacity: ${value};`
  // })
  // .add('colorHEX', {
  //   token: 'palette', 
  //   cssText: (value: string) => `color: ${value};`
  // })
  // .add('shadow', {
  //   token: 'shadow',
  //   cssText: (value: string) => `box-shadow: ${value};`
  // })
  // .add('height', {
  //   token: 'dimension.rowHeight',
  //   cssText: (value: number) => `height: ${value}px;`
  // })
  // .add('focus', {
  //   token: 'focus',
  //   cssText: (value) =>  value ? `
  //     &&:focus{
  //       box-shadow: ${value};
  //       position: relative;
  //       z-index: 2;
  //     }
  //   ` : ''
  // })
  .pseudoSelectors({
    hover: (rules) => `&&:hover{${rules}}`,
    // active: (rules) => `&&&:active{${rules}}`,
    disabled: (rules) => `&&&&:disabled{${rules}}`,
  })

const a = properties.list()['fontSize']
// properties.compute('fontSize', 's', tokens.scheme)
type Props = {
  /** Размер */
  size: 's' | 'm' | 'l'
  kind: 'fill' | 'outline'
}

type Props2 = {
  kind2: 'fill' | 'outline',
  kind3: 'fill' | 'outline'
}
type Props3 = {
  size: 's' | 'm' | 'l'
  size2: 's' | 'm' | 'l'
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
    asString: 'kkffsss',
    display: (props) => 'block',
    color: ['black', null],
    fontSize: 'xxl',
    hover: {
      grow: true
    }
  })
  .slot('base2', {
    asString: `
      color: red;
    `,
    color: ['black32', 'black32'],
    display: props => 'inline',
    hover: {
      disabled: {
        display: ['inline'],
        color: ['black24', 'red50'],
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
  export const _ = <T>(): T => {
    throw new Error("hole"); 
}