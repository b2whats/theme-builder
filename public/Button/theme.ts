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
  .mapProps(({ block }) => block && {
    width: 1,
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
      display: 'block',
      height: ({ size }) => size,
      color: 'white',
      bg: 'blue500',
      valign: 'middle',
      px: 'l',
      focus: false,
      hover: {
        bg: 'blue800',
      },
    }
  ], 'tag')