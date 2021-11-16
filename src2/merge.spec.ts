import { mergeObject, mergeTheme } from './merge'
import { ThemeBuilder, ComponentTheme, Slot } from './ThemeBuilder'

type ButtonTheme = ComponentTheme<{}, {
  Button: Slot,
}>

type TextTheme = ComponentTheme<{}, {
  Text: Slot,
}>

const ButtonTheme = new ThemeBuilder<ButtonTheme>()
  .slot('Button', {
    width: 100
  })

const ButtonTheme2 = new ThemeBuilder<ButtonTheme>()
  .slot('Button', {
    width: 200,
    height: 100,
  })
const TextTheme = new ThemeBuilder<TextTheme>()
  .slot('Text', {
    width: 200
  })

const target: object = {
  string: 'string',
  array: [1,2],
  number: 1,
  nestedObject: {
    object: {
      l: 1,
      m: 2,
      s: 3,
    },
    string: 'string',
    array: [1,2],
  },
  object: {
    l: 1,
    m: 2,
    s: 3,
  },
}

const source: object = {
  string: 'string 2',
  array: [11],
  number: 11,
  nestedObject: {
    object: {
      l: 11,
    },
    string: 'string 2',
    array: [22],
    additionalNumber: 11
  },
  object: {
    s: 33,
  },
  additionalString: 'additionalString'
}

const targetWithComponent: object = {
  ...target,
  Button: ButtonTheme
}

const sourceWithComponent: object = {
  ...source,
  Text: TextTheme
}


test('mergeObject', () => {
  const merge = mergeObject(target, source)

  expect(merge).toMatchSnapshot()
})

test('mergeObject - simple', () => {
  let firstArg = { one: 1, merge: 1 }
  let secondArg = { two: 2, merge: 2 }

  let firstResult = mergeTheme(firstArg, secondArg)
  let secondResult = mergeTheme(firstArg, secondArg)

  expect(firstResult).toBe(secondResult)
  expect(firstResult).toMatchSnapshot()

  let newArg = { two: 2, merge: 2 }
  let newResult = mergeTheme(firstArg, newArg)

  expect(newResult).not.toBe(firstResult)
  expect(newResult).toMatchSnapshot()
})

test('mergeTheme - with component', () => {
  let firstArg = { Button: ButtonTheme }
  let secondArg = { Text: TextTheme }

  let firstResult = mergeTheme(firstArg, secondArg)
  expect(firstResult).toMatchSnapshot()
})

test('mergeTheme - tokens with component', () => {
  let firstArg = { Button: ButtonTheme, one: 1 }
  let secondArg = { Text: TextTheme, one: '1', two: '2' }

  let firstResult = mergeTheme(firstArg, secondArg)
  expect(firstResult).toMatchSnapshot()
})

test('mergeTheme - tokens with same component', () => {
  let firstArg = { Button: ButtonTheme, one: 1 }
  let secondArg = { Button: ButtonTheme2, one: '1', two: '2' }

  let firstResult = mergeTheme(firstArg, secondArg)
  expect(firstResult).toMatchSnapshot()
})