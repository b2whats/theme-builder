import React from 'react'
import { Component, utils } from '../../src/Component'
import { createHook } from '../../src/createHook'

import { properties } from '../../src/fixtures'
import type { ButtonProps } from './contract'

const Icon = (props: { color: string }) => React.createElement('span', props, 'text')

const buttonTheme = new Component(properties)
  .name('Button')
  .types<ButtonProps>()
  .defaultProps({
    size: 'l',
  })
  // .mapProps((props) => ({
  //   size: 'm',
  // }))
  .slot('base', {
    asString: `
      box-sizing: border-box;
      & > .before {
        font-size: 20px;
      }
    `,
    // display: utils.if('shape', 'block', 'inline'),
    // // borderRadius: utils.map('shape', {
    //   pill: 50,
    //   square: 's',
    //   circle: 'circle',
    // }),
    color: ['blue500', 'red500', 'black'],
    // fontSize: (props) => 'xl',
    // // height: (props) => props.size || 40,
    hover: {
      color: 'black16',
    }
  })
  .slot('showPassword', {
    fontSize: (props) => 'xl',
    children: {
      component: Icon,
      color: ({ variant }) => variant === 'primary' ? 'black16' : 'black32'
    }
  })

  // type Children = {
  //   children: {
  //     component: (props: object) => void
  //   }
  // }


export const useStyle = createHook(buttonTheme)














// export type ButtonTheme = ComponentTheme<ButtonProps, {
//   Button: Slot,
//   Text: Slot<{ text: string }>,
// }>

// export const buttonTheme = new ThemeBuilder<ButtonTheme>()
//   .defaultProps({
//     size: 'm',
//     type: 'button',
//   })
//   .mapProps((props) => ({ pt: 1}))
//   .slot('Button', [
//     `
//       font-family: inherit;
//       cursor: pointer;
//       text-align: center;
//       text-decoration: none;
//       margin: 0;
//       border: 0;
//       line-height: 0;
//       position: relative;
//       white-space: nowrap;
//       -webkit-tap-highlight-color: rgba(0,0,0,0);
//       -webkit-touch-callout: none;
//       &::-moz-focus-inner {
//         border: 0;
//       }
//     `,
//     {
//       withProps: true,
//       display: 'inline-block',
//       width: utils.if('stretch', 'jjj'),
//       height: ({ size }) => size,
//       color: 'white',
//       bg: ['blue500', 'red700'],
//       px: 'l',
//       focus: false,
//       truncate: true,
//       hover: {
//         bg: utils.if('stretch', 'red700'),
//       },
//     },
//     utils.css`
//       ${(props, tokens, styles) => ''}
//     `,
//   ], 'button')
//   .slot('Text', [{
//     text: 'fef'
//   }])


// export const otherButtonTheme = new ThemeBuilder<ButtonTheme>()
//   .slot('Button', [
//     {
//       color: 'red400',
//       bg: 'green500',
//       hover: {
//         bg: 'green800',
//       },
//     }
//   ])


// type A = {
//   a: number
//   b: string
//   className: number
// }

// type B = 'className' & keyof A

// type WithConditionalCSSProp<P> = 'className' extends keyof P
//   ? string extends P['className' & keyof P]
//     ? { css?: any }
//     : {}
//   : {}

//   type C = WithConditionalCSSProp<A>

//   type qqq = A[never]
