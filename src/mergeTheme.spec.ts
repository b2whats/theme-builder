import { mergeObject, mergeTheme } from './mergeTheme'

export const target: object = {
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

export const source: object = {
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