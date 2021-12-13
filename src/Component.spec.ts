import { properties, tokens, component } from './fixtures'
import { Component } from './Component'
import { literalValues } from './utils'

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'function',
  print: (val) => `${val}`
})


const theme = {}
test('Component merge theme - none', () => {
  const empty = {}
  const notSame = {}
  const theme = component.mergeTheme(empty)
  const theme2 = component.mergeTheme(empty)
  const theme3 = component.mergeTheme(notSame)

  expect(theme).toMatchSnapshot()
  expect(theme === theme2).toBe(true)
  expect(theme !== theme3).toBe(true)
})



test('Component merge theme - all', () => {
  const componentTheme = literalValues({
    Button: {
      defaultProps: { size: 'm'},
      mapProps: (props: any) => ({ size: 'l' as 'l' }),
      slots: {
        base: {
          as: 'div',
          display: 'flex',
          color: ['primary', 'red'],
          fontSize: (props: any) => props.otherSize,
          hover: {
            display: 'flex',
            color: ['primary', 'red'],
            fontSize: (props: any) => props.otherSize,
          }
        }
      }
    }
  })
  const theme = component.mergeTheme(componentTheme)
  const theme2 = component.mergeTheme(componentTheme)
  const theme3 = component.mergeTheme({...componentTheme})

  expect(theme === theme2).toBe(true)
  expect(theme !== theme3).toBe(true)

  expect(theme).toMatchSnapshot()
})
test('Component merge theme - undefined', () => {
  const componentTheme = literalValues({
    Button: {
      defaultProps: undefined,
      mapProps: undefined,
      slots: {
        base: {
          as: 'div',
          display: undefined,
          color: undefined,
          fontSize: undefined,
          hover: {
            display: undefined,
            color: undefined,
            fontSize: undefined,
          }
        }
      }
    }
  })
  const theme = component.mergeTheme(componentTheme)

  expect(theme).toMatchSnapshot()
})


test('Component execute', () => {
  const props = literalValues({
    size: 's'
  })
  const theme = {}
  const result = component.execute(theme, props)

  expect(result).toMatchSnapshot()
})

test('Component execute array', () => {
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
  
  const props: Props = {
    size: 'l',
    name: 'sbmt',
    kind: 'fill',
    type: 'button',
    shape: 'pill',
  }

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
    display: ['block', 'flex'],
    color: ['black', 'black12'],
    fontSize: ['s', 's'],
    lineHeight: ['none', 'dense'],
    italic: [true, false],
    noWrap: [true, false],
    uppercase: [true, false],
    cursor: ['pointer', 'disabled'],
    smoothing: ['antialiased', 'auto'],
    borderRadius: ['l', 'm'],
    column: [true, false],
    hover: {
      display: ['block', 'flex'],
      color: ['black', 'black12'],
      fontSize: ['s', 's'],
      lineHeight: ['none', 'dense'],
      italic: [true, false],
      noWrap: [true, false],
      uppercase: [true, false],
      cursor: ['pointer', 'disabled'],
      smoothing: ['antialiased', 'auto'],
      borderRadius: ['l', 'm'],
      column: [true, false],
    },
    active: {
      display: ['block', 'flex'],
      color: ['black', 'black12'],
      fontSize: ['s', 's'],
      lineHeight: ['none', 'dense'],
      italic: [true, false],
      noWrap: [true, false],
      uppercase: [true, false],
      cursor: ['pointer', 'disabled'],
      smoothing: ['antialiased', 'auto'],
      borderRadius: ['l', 'm'],
      column: [true, false],
    }
  })

  expect(arrayComponent.execute({}, props)).toMatchSnapshot()
})