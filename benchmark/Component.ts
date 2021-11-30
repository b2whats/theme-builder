import Benchmark from 'benchmark'
import { properties, tokens } from '../src/fixtures'
import { Component } from '../src/Component'
import stringify from 'fast-stringify';
const safeStringify = require('fast-safe-stringify')

type Props = {
  children?: any
  size?: 's' | 'm' | 'l'
  name?: string
  value?: string | number
  kind?: 'fill' | 'outline' | 'flat'
  checked?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  shape?: 'pill' | 'square' | 'circle'
  href?: string
}

const obj = {
  string: 'string',
  string2: 'string2',
  string3: 'string3',
  string4: 'string4',
  string5: 'string5',
  number: 'number',
  number2: 'number2',
  number3: 'number3',
  number4: 'number4',
  number5: 'number5',
  array: [1,2,3,4,5],
  array2: [1,2,3,4,5],
  array3: [1,2,3,4,5],
  array4: [1,2,3,4,5],
  array5: [1,2,3,4,5],
  arrayS: ['color', 'color', 'color', 'color', 'color'],
  arrayS2: ['color', 'color', 'color', 'color', 'color'],
  arrayS3: ['color', 'color', 'color', 'color', 'color'],
  arrayS4: ['color', 'color', 'color', 'color', 'color'],
  arrayS5: ['color', 'color', 'color', 'color', 'color'],
  null: null,
  null2: null,
  null3: null,
  null4: null,
  null5: null,
  undefined: undefined,
  undefined2: undefined,
  undefined3: undefined,
  undefined4: undefined,
  undefined5: undefined,
  fn: () => {},
  fn2: () => {},
  fn3: () => {},
  fn4: () => {},
  fn5: () => {},
}
const objSmall = {
  string: 'string',
  string2: 'string2',
  number: 1,
  number2: 1,
  array: [1,2,3,4,5],
  array2: [1,2,3,4,5],
  arrayS: ['color', 'color', 'color', 'color', 'color'],
  arrayS2: ['color', 'color', 'color', 'color', 'color'],
  null: null,
  null2: null,
  undefined: undefined,
  undefined2: undefined,
  fn: () => {},
  fn2: () => {},
}

const props: Props = {
  size: 'l',
  name: 'sbmt',
  kind: 'fill',
  type: 'button',
  shape: 'pill',
}
const simpleComponent = new Component(properties)
  .name('Button')
  .types<Props>()
  .defaultProps({
    size: 's',
    kind: 'flat',
    checked: false,
  })
  .mapProps((props) => ({
    size: 'm'
  }))
  .slot('button', {
    display: 'block',
    color: 'black',
    fontSize: 's',
    lineHeight: 'none',
    italic: true,
    noWrap: true,
    uppercase: true,
    cursor: 'pointer',
    smoothing: 'antialiased',
    borderRadius: 'l',
    column: false,
    hover: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    },
    active: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    }
  })
  .slot('button2', {
    display: 'block',
    color: 'black',
    fontSize: 's',
    lineHeight: 'none',
    italic: true,
    noWrap: true,
    uppercase: true,
    cursor: 'pointer',
    smoothing: 'antialiased',
    borderRadius: 'l',
    column: false,
    hover: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    },
    active: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    }
  })
  .slot('button3', {
    display: 'block',
    color: 'black',
    fontSize: 's',
    lineHeight: 'none',
    italic: true,
    noWrap: true,
    uppercase: true,
    cursor: 'pointer',
    smoothing: 'antialiased',
    borderRadius: 'l',
    column: false,
    hover: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    },
    active: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    }
  })
  .slot('button4', {
    display: 'block',
    color: 'black',
    fontSize: 's',
    lineHeight: 'none',
    italic: true,
    noWrap: true,
    uppercase: true,
    cursor: 'pointer',
    smoothing: 'antialiased',
    borderRadius: 'l',
    column: false,
    hover: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    },
    active: {
      display: 'block',
      color: 'black',
      fontSize: 's',
      lineHeight: 'none',
      italic: true,
      noWrap: true,
      uppercase: true,
      cursor: 'pointer',
      smoothing: 'antialiased',
      borderRadius: 'l',
      column: false,
    }
  })

const arrayComponent = new Component(properties)
  .name('Button')
  .types<Props>()
  .defaultProps({
    size: 's',
    kind: 'flat',
    checked: false,
  })
  .mapProps((props) => ({
    size: 'm'
  }))
  .slot('button', {
    display: ['block', 'flex', 'block', 'flex'],
    color: ['black', 'black12', 'black', 'black12'],
    fontSize: ['s', 's', 's', 's'],
    lineHeight: ['none', 'dense', 'none', 'dense'],
    italic: [true, false, true, false],
    noWrap: [true, false, true, false],
    uppercase: [true, false, true, false],
    cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
    smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
    borderRadius: ['l', 'm', 'l', 'm'],
    column: [true, false, true, false],
    hover: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    },
    active: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    }
  })
  .slot('button2', {
    display: ['block', 'flex', 'block', 'flex'],
    color: ['black', 'black12', 'black', 'black12'],
    fontSize: ['s', 's', 's', 's'],
    lineHeight: ['none', 'dense', 'none', 'dense'],
    italic: [true, false, true, false],
    noWrap: [true, false, true, false],
    uppercase: [true, false, true, false],
    cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
    smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
    borderRadius: ['l', 'm', 'l', 'm'],
    column: [true, false, true, false],
    hover: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    },
    active: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    }
  })
  .slot('button3', {
    display: ['block', 'flex', 'block', 'flex'],
    color: ['black', 'black12', 'black', 'black12'],
    fontSize: ['s', 's', 's', 's'],
    lineHeight: ['none', 'dense', 'none', 'dense'],
    italic: [true, false, true, false],
    noWrap: [true, false, true, false],
    uppercase: [true, false, true, false],
    cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
    smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
    borderRadius: ['l', 'm', 'l', 'm'],
    column: [true, false, true, false],
    hover: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    },
    active: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    }
  })
  .slot('button4', {
    display: ['block', 'flex', 'block', 'flex'],
    color: ['black', 'black12', 'black', 'black12'],
    fontSize: ['s', 's', 's', 's'],
    lineHeight: ['none', 'dense', 'none', 'dense'],
    italic: [true, false, true, false],
    noWrap: [true, false, true, false],
    uppercase: [true, false, true, false],
    cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
    smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
    borderRadius: ['l', 'm', 'l', 'm'],
    column: [true, false, true, false],
    hover: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    },
    active: {
      display: ['block', 'flex', 'block', 'flex'],
      color: ['black', 'black12', 'black', 'black12'],
      fontSize: ['s', 's', 's', 's'],
      lineHeight: ['none', 'dense', 'none', 'dense'],
      italic: [true, false, true, false],
      noWrap: [true, false, true, false],
      uppercase: [true, false, true, false],
      cursor: ['pointer', 'disabled', 'pointer', 'disabled'],
      smoothing: ['antialiased', 'auto', 'antialiased', 'auto'],
      borderRadius: ['l', 'm', 'l', 'm'],
      column: [true, false, true, false],
    }
  })
  
var suite = new Benchmark.Suite;

suite.add('JSON.stringify', function() {
  JSON.stringify(objSmall)
})

const hash = (obj: any) => {
  let str = ''
  for (const key in obj) {
    let value = obj[key]
    const type = typeof value

    if (type === 'string' || type === 'number') {
      str += key + value
    } else if (Array.isArray(value)){
      str += key + value.join('|')
    } else if (value === true) {
      str += key + 'T;'
    } else if (value === false) {
      str += key + 'F;'
    } else if(value === null || value === undefined) {
      str += key + 'void;'
    } else if (type === 'function') {
      str += key + 'fn;'
    }
  }

  return str
}

suite.add('fast JSON.stringify hash', function() {
  hash(objSmall)
})




suite.add('Component simple', function() {
  simpleComponent.execute({}, props)
})
suite.add('Component simple with theme', function() {
  simpleComponent.execute(tokens.scheme, props)
})

suite.add('Component array', function() {
  arrayComponent.execute({}, props)
})
suite.add('Component array with theme', function() {
  arrayComponent.execute(tokens.scheme, props)
})



suite.on('cycle', function(event: any) {
  console.log(String(event.target));
})
.run({ 'async': true });


/*
without token(No cache) x 824,016,793 ops/sec ±1.52% (82 runs sampled)
nested token(No cache) x 2,316,602 ops/sec ±1.29% (93 runs sampled)
boolean token(No cache) x 7,086,732 ops/sec ±0.73% (90 runs sampled)
*/