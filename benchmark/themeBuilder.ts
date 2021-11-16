// @1ts-nocheck
import Benchmark from 'benchmark'
import { ThemeBuilder, utils, ComponentTheme, Slot } from '../src2/ThemeBuilder'
import type { StyleProperties } from '../src2/StyleProperties'
import { tokens } from '../src2/public/tokens'
import { mergeObject, weakMemoize, memoize } from '../src2/merge'

interface ButtonProps extends StyleProperties {
  size?: 's' | 'm' | 'l'
  kind?: 'fill' | 'outline' | 'flat'
  checked?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  shape?: 'pill' | 'square' | 'circle'
}

export type ButtonTheme = ComponentTheme<ButtonProps, {
  Button: Slot,
  Text: Slot,
}>

export const simple = new ThemeBuilder<ButtonTheme>()
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
      width: 1,
      height: 111,
      color: 'white',
      bg: 'blue500',
      px: 'l',
      focus: false,
      truncate: true,
      hover: {
        bg: 'blue800',
      },
    },
  ], 'div')

  export const simple2 = new ThemeBuilder<ButtonTheme>()
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
      width: 1,
      height: 111,
      color: 'white',
      bg: 'blue500',
      px: 'l',
      focus: false,
      truncate: true,
      hover: {
        bg: 'blue800',
      },
    },
  ], 'div')
  .slot('Text', [
    `
      &::-moz-focus-inner {
        border: 0;
      }
    `,
    {
      withProps: true,
      display: 'block',
      width: 2,
      height: 222,
      color: 'black',
      bg: 'blue700',
      px: 'l',
      focus: true,
      truncate: false,
      hover: {
        bg: 'blue800',
      },
    },
  ], 'div')

const complex = new ThemeBuilder<ButtonTheme>()
  .slot('Button', [
    {
      withProps: true,
      fontFamily: 'arial',
      fontSize: 'xl',
      lineHeight: 'dense',
      letterSpacing: 2,
      fontWeight: 300,
      italic: true,
      noWrap: true,
      pre: true,
      wrap: true,
      uppercase: true,
      cursor: 'pointer',
      truncate: true,
      smoothing: 'antialiased',
      height: 100,
      minHeight: 50,
      maxHeight: 200,
      width: 200,
      minWidth: 100,
      maxWidth: 300,
      grow: true,
      shrink: true,
      order: 2,
      borderWidth: 3,
      borderTopWidth: 2,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderLeftWidth: 3,
      borderStyle: 'dashed',
      borderTopStyle: 'dotted',
      borderRightStyle: 'solid',
      borderBottomStyle: 'dotted',
      borderLeftStyle: 'dashed',
      borderRadius: 5,
      align: 'justify',
      alignSelf: 'left',
      valign: 'baseline',
      valignSelf: 'stretch',
      column: true,
      color: 'red400',
      bg: 'red50',
      borderColor: 'green400',
      placeholderColor: 'red700',
      position: 'absolute',
      top: 5,
      right: 7,
      bottom: 8,
      left: 9,
      overflow: 'auto',
      visible: false,
      opacity: 6,
      focus: true,
      pointerEvents: true,
      shape: 'circle',
      shadow: 3,
      zIndex: 'dropdown',
      userSelect: false,
      transition: 'fade',
      display: 'block',
      pt: 's',
      pr: 's',
      pb: 's',
      pl: 's',
      mt: 's',
      mr: 's',
      mb: 's',
      ml: 's',
    },
  ], 'div')

const complexFn = new ThemeBuilder<ButtonTheme>()
  .slot('Button', [
    {
      withProps: true,
      fontFamily: (props) => 'arial',
      fontSize: (props) => 'xl',
      lineHeight: (props) => 'dense',
      letterSpacing: (props) => 2,
      fontWeight: (props) => 300,
      italic: (props) => true,
      noWrap: (props) => true,
      pre: (props) => true,
      wrap: (props) => true,
      uppercase: (props) => true,
      cursor: (props) => 'pointer',
      truncate: (props) => true,
      smoothing: (props) => 'antialiased',
      height: (props) => 100,
      minHeight: (props) => 50,
      maxHeight: (props) => 200,
      width: (props) => 200,
      minWidth: (props) => 100,
      maxWidth: (props) => 300,
      grow: (props) => true,
      shrink: (props) => true,
      order: (props) => 2,
      borderWidth: (props) => 3,
      borderTopWidth: (props) => 2,
      borderRightWidth: (props) => 2,
      borderBottomWidth: (props) => 2,
      borderLeftWidth: (props) => 3,
      borderStyle: (props) => 'dashed',
      borderTopStyle: (props) => 'dotted',
      borderRightStyle: (props) => 'solid',
      borderBottomStyle: (props) => 'dotted',
      borderLeftStyle: (props) => 'dashed',
      borderRadius: (props) => 5,
      align: (props) => 'justify',
      alignSelf: (props) => 'left',
      valign: (props) => 'baseline',
      valignSelf: (props) => 'stretch',
      column: (props) => true,
      color: (props) => 'red400',
      bg: (props) => 'red50',
      borderColor: (props) => 'green400',
      placeholderColor: (props) => 'red700',
      position: (props) => 'absolute',
      top: (props) => 5,
      right: (props) => 7,
      bottom: (props) => 8,
      left: (props) => 9,
      overflow: (props) => 'auto',
      visible: (props) => false,
      opacity: (props) => 6,
      focus: (props) => true,
      pointerEvents: (props) => true,
      shape: (props) => 'circle',
      shadow: (props) => 3,
      zIndex: (props) => 'dropdown',
      userSelect: (props) => false,
      transition: (props) => 'fade',
      display: (props) => 'block',
      pt: (props) => 's',
      pr: (props) => 's',
      pb: (props) => 's',
      pl: (props) => 's',
      mt: (props) => 's',
      mr: (props) => 's',
      mb: (props) => 's',
      ml: (props) => 's',
    },
  ], 'div')

const complexResponsive1 = new ThemeBuilder<ButtonTheme>()
  .slot('Button', [
    {
      withProps: true,
      fontFamily: ['arial'],
      fontSize: ['xl'],
      lineHeight: ['dense'],
      letterSpacing: [2],
      fontWeight: [300],
      italic: [true],
      noWrap: [true],
      pre: [true],
      wrap: [true],
      uppercase: [true],
      cursor: ['pointer'],
      truncate: [true],
      smoothing: ['antialiased'],
      height: [100],
      minHeight: [50],
      maxHeight: [200],
      width: [200],
      minWidth: [100],
      maxWidth: [300],
      grow: [true],
      shrink: [true],
      order: [2],
      borderWidth: [3],
      borderTopWidth: [2],
      borderRightWidth: [2],
      borderBottomWidth: [2],
      borderLeftWidth: [3],
      borderStyle: ['dashed'],
      borderTopStyle: ['dotted'],
      borderRightStyle: ['solid'],
      borderBottomStyle: ['dotted'],
      borderLeftStyle: ['dashed'],
      borderRadius: [5],
      align: ['justify'],
      alignSelf: ['left'],
      valign: ['baseline'],
      valignSelf: ['stretch'],
      column: [true],
      color: ['red400'],
      bg: ['red50'],
      borderColor: ['green400'],
      placeholderColor: ['red700'],
      position: ['absolute'],
      top: [5],
      right: [7],
      bottom: [8],
      left: [9],
      overflow: ['auto'],
      visible: [false],
      opacity: [6],
      focus: [true],
      pointerEvents: [true],
      shape: ['circle'],
      shadow: [3],
      zIndex: ['dropdown'],
      userSelect: [false],
      transition: ['fade'],
      display: ['block'],
      pt: ['s'],
      pr: ['s'],
      pb: ['s'],
      pl: ['s'],
      mt: ['s'],
      mr: ['s'],
      mb: ['s'],
      ml: ['s'],
    },
  ], 'div')

const complexResponsive4 = new ThemeBuilder<ButtonTheme>()
  .slot('Button', [
    {
      withProps: true,
      fontFamily: ['arial', 'arial', 'arial', 'arial'],
      fontSize: ['xl', 'xl', 'xl', 'xl'],
      lineHeight: ['dense', 'dense', 'dense', 'dense'],
      letterSpacing: [2, 2, 2, 2],
      fontWeight: [300, 300, 300, 300],
      italic: [true, true, true, true],
      noWrap: [true, true, true, true],
      pre: [true, true, true, true],
      wrap: [true, true, true, true],
      uppercase: [true, true, true, true],
      cursor: ['pointer', 'pointer', 'pointer', 'pointer'],
      truncate: [true, true, true, true],
      smoothing: ['antialiased', 'antialiased', 'antialiased', 'antialiased'],
      height: [100, null, 100, 100],
      minHeight: [50, 50, 50, 50],
      maxHeight: [200, 200, 200, 200],
      width: [200, 200, 200, 200],
      minWidth: [100, 100, 100, 100],
      maxWidth: [300, 300, 300, 300],
      grow: [true, true, true, true],
      shrink: [true, true, true, true],
      order: [2, 2, 2, 2],
      borderWidth: [3, 3, 3, 3],
      borderTopWidth: [2, 2, 2, 2],
      borderRightWidth: [2, 2, 2, 2],
      borderBottomWidth: [2, 2, 2, 2],
      borderLeftWidth: [3, 3, 3, 3],
      borderStyle: ['dashed', 'dashed', 'dashed', 'dashed'],
      borderTopStyle: ['dotted', 'dotted', 'dotted', 'dotted'],
      borderRightStyle: ['solid', 'solid', 'solid', 'solid'],
      borderBottomStyle: ['dotted', 'dotted', 'dotted', 'dotted'],
      borderLeftStyle: ['dashed', 'dashed', 'dashed', 'dashed'],
      borderRadius: [5, 5, 5, 5],
      align: ['justify', 'justify', 'justify', 'justify'],
      alignSelf: ['left', 'left', 'left', 'left'],
      valign: ['baseline', 'baseline', 'baseline', 'baseline'],
      valignSelf: ['stretch', 'stretch', 'stretch', 'stretch'],
      column: [true, true, true, true],
      color: ['red400', 'red400', 'red400', 'red400'],
      bg: ['red50', 'red50', 'red50', 'red50'],
      borderColor: ['green400', 'green400', 'green400', 'green400'],
      placeholderColor: ['red700', 'red700', 'red700', 'red700'],
      position: ['absolute', 'absolute', 'absolute', 'absolute'],
      top: [5, 5, 5, 5],
      right: [7, 7, 7, 7],
      bottom: [8, 8, 8, 8],
      left: [9, 9, 9, 9],
      overflow: ['auto', 'auto', 'auto', 'auto'],
      visible: [false, false, false, false],
      opacity: [6, 6, 6, 6],
      focus: [true, true, true, true],
      pointerEvents: [true, true, true, true],
      shape: ['circle', 'circle', 'circle', 'circle'],
      shadow: [3, 3, 3, 3],
      zIndex: ['dropdown', 'dropdown', 'dropdown', 'dropdown'],
      userSelect: [false, false, false, false],
      transition: ['fade', 'fade', 'fade', 'fade'],
      display: ['block', 'block', 'block', 'block'],
      pt: ['s', 's', 's', 's'],
      pr: ['s', 's', 's', 's'],
      pb: ['s', 's', 's', 's'],
      pl: ['s', 's', 's', 's'],
      mt: ['s', 's', 's', 's'],
      mr: ['s', 's', 's', 's'],
      mb: ['s', 's', 's', 's'],
      ml: ['s', 's', 's', 's'],
    },
  ], 'div')

const complexResponsive8 = new ThemeBuilder<ButtonTheme>()
  .slot('Text', [
    {
      withProps: true,
      fontFamily: ['arial', 'arial', 'arial', 'arial'],
      fontSize: ['xl', 'xl', 'xl', 'xl'],
      lineHeight: ['dense', 'dense', 'dense', 'dense'],
      letterSpacing: [2, 2, 2, 2],
      fontWeight: [300, 300, 300, 300],
      italic: [true, true, true, true],
      noWrap: [true, true, true, true],
      pre: [true, true, true, true],
      wrap: [true, true, true, true],
      uppercase: [true, true, true, true],
      cursor: ['pointer', 'pointer', 'pointer', 'pointer'],
      truncate: [true, true, true, true],
      smoothing: ['antialiased', 'antialiased', 'antialiased', 'antialiased'],
      height: [100, null, 100, 100],
      minHeight: [50, 50, 50, 50],
      maxHeight: [200, 200, 200, 200],
      width: [200, 200, 200, 200],
      minWidth: [100, 100, 100, 100],
      maxWidth: [300, 300, 300, 300],
      grow: [true, true, true, true],
      shrink: [true, true, true, true],
      order: [2, 2, 2, 2],
      borderWidth: [3, 3, 3, 3],
      borderTopWidth: [2, 2, 2, 2],
      borderRightWidth: [2, 2, 2, 2],
      borderBottomWidth: [2, 2, 2, 2],
      borderLeftWidth: [3, 3, 3, 3],
      borderStyle: ['dashed', 'dashed', 'dashed', 'dashed'],
      borderTopStyle: ['dotted', 'dotted', 'dotted', 'dotted'],
      borderRightStyle: ['solid', 'solid', 'solid', 'solid'],
      borderBottomStyle: ['dotted', 'dotted', 'dotted', 'dotted'],
      borderLeftStyle: ['dashed', 'dashed', 'dashed', 'dashed'],
      borderRadius: [5, 5, 5, 5],
      align: ['justify', 'justify', 'justify', 'justify'],
      alignSelf: ['left', 'left', 'left', 'left'],
      valign: ['baseline', 'baseline', 'baseline', 'baseline'],
      valignSelf: ['stretch', 'stretch', 'stretch', 'stretch'],
      column: [true, true, true, true],
      color: ['red400', 'red400', 'red400', 'red400'],
      bg: ['red50', 'red50', 'red50', 'red50'],
      borderColor: ['green400', 'green400', 'green400', 'green400'],
      placeholderColor: ['red700', 'red700', 'red700', 'red700'],
      position: ['absolute', 'absolute', 'absolute', 'absolute'],
      top: [5, 5, 5, 5],
      right: [7, 7, 7, 7],
      bottom: [8, 8, 8, 8],
      left: [9, 9, 9, 9],
      overflow: ['auto', 'auto', 'auto', 'auto'],
      visible: [false, false, false, false],
      opacity: [6, 6, 6, 6],
      focus: [true, true, true, true],
      pointerEvents: [true, true, true, true],
      shape: ['circle', 'circle', 'circle', 'circle'],
      shadow: [3, 3, 3, 3],
      zIndex: ['dropdown', 'dropdown', 'dropdown', 'dropdown'],
      userSelect: [false, false, false, false],
      transition: ['fade', 'fade', 'fade', 'fade'],
      display: ['block', 'block', 'block', 'block'],
      pt: ['s', 's', 's', 's'],
      pr: ['s', 's', 's', 's'],
      pb: ['s', 's', 's', 's'],
      pl: ['s', 's', 's', 's'],
      mt: ['s', 's', 's', 's'],
      mr: ['s', 's', 's', 's'],
      mb: ['s', 's', 's', 's'],
      ml: ['s', 's', 's', 's'],
    },
  ], 'div')
  .slot('Button', [
    {
      withProps: true,
      fontFamily: ['arial', 'arial', 'arial', 'arial'],
      fontSize: ['xl', 'xl', 'xl', 'xl'],
      lineHeight: ['dense', 'dense', 'dense', 'dense'],
      letterSpacing: [2, 2, 2, 2],
      fontWeight: [300, 300, 300, 300],
      italic: [true, true, true, true],
      noWrap: [true, true, true, true],
      pre: [true, true, true, true],
      wrap: [true, true, true, true],
      uppercase: [true, true, true, true],
      cursor: ['pointer', 'pointer', 'pointer', 'pointer'],
      truncate: [true, true, true, true],
      smoothing: ['antialiased', 'antialiased', 'antialiased', 'antialiased'],
      height: [100, null, 100, 100],
      minHeight: [50, 50, 50, 50],
      maxHeight: [200, 200, 200, 200],
      width: [200, 200, 200, 200],
      minWidth: [100, 100, 100, 100],
      maxWidth: [300, 300, 300, 300],
      grow: [true, true, true, true],
      shrink: [true, true, true, true],
      order: [2, 2, 2, 2],
      borderWidth: [3, 3, 3, 3],
      borderTopWidth: [2, 2, 2, 2],
      borderRightWidth: [2, 2, 2, 2],
      borderBottomWidth: [2, 2, 2, 2],
      borderLeftWidth: [3, 3, 3, 3],
      borderStyle: ['dashed', 'dashed', 'dashed', 'dashed'],
      borderTopStyle: ['dotted', 'dotted', 'dotted', 'dotted'],
      borderRightStyle: ['solid', 'solid', 'solid', 'solid'],
      borderBottomStyle: ['dotted', 'dotted', 'dotted', 'dotted'],
      borderLeftStyle: ['dashed', 'dashed', 'dashed', 'dashed'],
      borderRadius: [5, 5, 5, 5],
      align: ['justify', 'justify', 'justify', 'justify'],
      alignSelf: ['left', 'left', 'left', 'left'],
      valign: ['baseline', 'baseline', 'baseline', 'baseline'],
      valignSelf: ['stretch', 'stretch', 'stretch', 'stretch'],
      column: [true, true, true, true],
      color: ['red400', 'red400', 'red400', 'red400'],
      bg: ['red50', 'red50', 'red50', 'red50'],
      borderColor: ['green400', 'green400', 'green400', 'green400'],
      placeholderColor: ['red700', 'red700', 'red700', 'red700'],
      position: ['absolute', 'absolute', 'absolute', 'absolute'],
      top: [5, 5, 5, 5],
      right: [7, 7, 7, 7],
      bottom: [8, 8, 8, 8],
      left: [9, 9, 9, 9],
      overflow: ['auto', 'auto', 'auto', 'auto'],
      visible: [false, false, false, false],
      opacity: [6, 6, 6, 6],
      focus: [true, true, true, true],
      pointerEvents: [true, true, true, true],
      shape: ['circle', 'circle', 'circle', 'circle'],
      shadow: [3, 3, 3, 3],
      zIndex: ['dropdown', 'dropdown', 'dropdown', 'dropdown'],
      userSelect: [false, false, false, false],
      transition: ['fade', 'fade', 'fade', 'fade'],
      display: ['block', 'block', 'block', 'block'],
      pt: ['s', 's', 's', 's'],
      pr: ['s', 's', 's', 's'],
      pb: ['s', 's', 's', 's'],
      pl: ['s', 's', 's', 's'],
      mt: ['s', 's', 's', 's'],
      mr: ['s', 's', 's', 's'],
      mb: ['s', 's', 's', 's'],
      ml: ['s', 's', 's', 's'],
    },
  ], 'div')
const props: ButtonProps = {
  size: 's',
  kind: 'fill',
  checked: false,
  type: 'button',
}

var suite = new Benchmark.Suite;
let i = 0

const weakMemoizeTest = weakMemoize((arg) => arg)
const test = (a: typeof tokens) => (aa: any) => a.font.color + aa.size

// suite.add('weakMemoizeTest', function() {
//   weakMemoizeTest(tokens)
// })
// suite.add('test', function() {
//   test(tokens)(props)
// })
// suite.add('simple', function() {
//   simple.compute(tokens)(props)
// })
// suite.add('simple 2 slots', function() {
//   simple2.compute(tokens)(props)
// })
// suite.add('complex', function() {
//   complex.compute(tokens)(props)
// })
// suite.add('complex with function', function() {
//   complexFn.compute(tokens)(props)
// })
// suite.add('complex responsive 1', function() {
//   complexResponsive1.compute(tokens)(props)
// })
// suite.add('complex responsive 4', function() {
//   complexResponsive4.compute(tokens)(props)
// })
// suite.add('complex responsive with 2 slot', function() {
//   complexResponsive8.compute(tokens)(props)
// })
// .on('cycle', function(event: any) {
//   console.log(String(event.target));
// })
// .run({ 'async': true });


/*
  simple x 84,841 ops/sec ±0.56% (89 runs sampled)
  simple 2 slots x 41,481 ops/sec ±1.29% (86 runs sampled)
  complex x 20,171 ops/sec ±0.57% (89 runs sampled)
  complex with function x 18,843 ops/sec ±1.63% (89 runs sampled)
  complex responsive 1 x 19,481 ops/sec ±1.50% (91 runs sampled)
  complex responsive 4 x 9,147 ops/sec ±0.56% (89 runs sampled)
*/

console.log(simple.compute(tokens)(props))
