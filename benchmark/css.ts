// @ts-nocheck
import Benchmark from 'benchmark'
import { css } from '@emotion/css'

var suite = new Benchmark.Suite;
let i = 0
suite.add('css 100', function() {
  css`
    color: red;
    background-color: red;
    display: block;
    &:hover {
      color: green;
      display: block;
    }
  `
})
suite.add('css dynamic 100', function() {
  css`
    &::before {
      content: ${i++}
    }
    color: red;
    background-color: red;
    display: block;
    &:hover {
      color: green;
      display: block;
    }
  `
})
suite.add('css 1 000', function() {
  css`
    font-family: inherit;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    margin: 0;
    line-height: 0;
    position: relative;
    white-space: nowrap;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-touch-callout: none;
    &::-moz-focus-inner {
      border: 0;
    }

    &[data-group] {
      box-shadow: none;
    }

    &[data-group~='horizontal']:not([data-group~='last']):not([data-group~='spacing']) {
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
    }

    &[data-group~='horizontal']:not([data-group~='first']):not([data-group~='spacing']) {
      border-bottom-left-radius: 0px;
      border-top-left-radius: 0px;
    }

    &[data-group~='vertical']:not([data-group~='last']):not([data-group~='spacing']) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    &[data-group~='vertical']:not([data-group~='first']):not([data-group~='spacing']) {
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
    }

    a& {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    a&:after { /* https://github.com/philipwalton/flexbugs#flexbug-3 */
      content: '';
      min-height: inherit;
      font-size: 0;
    }

    & > [data-icon='spinner'] {
      position: absolute;
      margin: auto;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
    }

    &[aria-busy='true'] > :not([data-icon='spinner']) {
      visibility: hidden;
    }
  `
})
suite.add('css dynamic 1 000', function() {
  css`
    &::before {
      content: ${i++}
    }
    font-family: inherit;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    margin: 0;
    line-height: 0;
    position: relative;
    white-space: nowrap;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-touch-callout: none;
    &::-moz-focus-inner {
      border: 0;
    }

    &[data-group] {
      box-shadow: none;
    }

    &[data-group~='horizontal']:not([data-group~='last']):not([data-group~='spacing']) {
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
    }

    &[data-group~='horizontal']:not([data-group~='first']):not([data-group~='spacing']) {
      border-bottom-left-radius: 0px;
      border-top-left-radius: 0px;
    }

    &[data-group~='vertical']:not([data-group~='last']):not([data-group~='spacing']) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    &[data-group~='vertical']:not([data-group~='first']):not([data-group~='spacing']) {
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
    }

    a& {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    a&:after { /* https://github.com/philipwalton/flexbugs#flexbug-3 */
      content: '';
      min-height: inherit;
      font-size: 0;
    }

    & > [data-icon='spinner'] {
      position: absolute;
      margin: auto;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
    }

    &[aria-busy='true'] > :not([data-icon='spinner']) {
      visibility: hidden;
    }
  `
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': true });