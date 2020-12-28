import { ThemeBuilder, utils, ComponentTheme, Slot } from '../../src/ThemeBuilder'
import { ButtonProps } from './contract'

export type ButtonTheme = ComponentTheme<ButtonProps, {
  Button: Slot,
  Text: Slot,
}>

export const buttonTheme = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
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
      width: utils.if('block', 1),
      height: ({ size }) => size,
      color: 'white',
      bg: 'blue500',
      px: 'l',
      focus: false,
      truncate: true,
      hover: {
        bg: 'blue800',
      },
    },
    utils.css`
      ${(props, tokens, styles) => ''}
    `,
  ], 'tag')
  .slot('Text', [{

  }], 'component')


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