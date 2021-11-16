import { ThemeBuilder, utils, ComponentTheme, Slot } from '../../ThemeBuilder'
import { ButtonProps } from './contract'

export type ButtonTheme = ComponentTheme<ButtonProps, {
  Button: Slot,
  Text: Slot<{ text: string }>,
}>

export const buttonTheme = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps((props) => ({ pt: 1}))
  .slot('Button', [
    `
      font-family: inherit;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      margin: 0;
      border: 0;
      line-height: 0;
      position: relative;
      white-space: nowrap;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-touch-callout: none;
      &::-moz-focus-inner {
        border: 0;
      }
    `,
    {
      withProps: true,
      display: 'inline-block',
      width: utils.if('stretch', 'jjj'),
      height: ({ size }) => size,
      color: 'white',
      bg: ['blue500', 'red700'],
      px: 'l',
      focus: false,
      truncate: true,
      hover: {
        bg: utils.if('stretch', 'red700'),
      },
    },
    utils.css`
      ${(props, tokens, styles) => ''}
    `,
  ], 'button')
  .slot('Text', [{
    text: 'fef'
  }])


export const otherButtonTheme = new ThemeBuilder<ButtonTheme>()
  .slot('Button', [
    {
      color: 'red400',
      bg: 'green500',
      hover: {
        bg: 'green800',
      },
    }
  ])


type A = {
  a: number
  b: string
  className: number
}

type B = 'className' & keyof A

type WithConditionalCSSProp<P> = 'className' extends keyof P
  ? string extends P['className' & keyof P]
    ? { css?: any }
    : {}
  : {}

  type C = WithConditionalCSSProp<A>

  type qqq = A[never]
