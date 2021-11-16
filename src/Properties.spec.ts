import { properties, tokens } from './fixtures'

test('Properties compute - without token', () => {
  const rule = properties.compute('display', 'block', tokens.scheme)
  const cache = properties.hasCache('display', 'block', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token resolve', () => {
  const rule = properties.compute('color', 'red', tokens.scheme)
  const cache = properties.hasCache('color', 'red', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token no resolve', () => {
  const rule = properties.compute('color', '#hex', tokens.scheme)
  const cache = properties.hasCache('color', '#hex', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token resolve (deep)', () => {
  const rule = properties.compute('fontSize', 's', tokens.scheme)
  const cache = properties.hasCache('fontSize', 's', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token(number) resolve', () => {
  const rule = properties.compute('shadow', 1, tokens.scheme)
  const cache = properties.hasCache('shadow', 1, tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token(boolean) resolve', () => {
  const rule = properties.compute('focus', true, tokens.scheme)
  const cache = properties.hasCache('focus', true, tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token(boolean) no resolve', () => {
  const rule = properties.compute('focus', false, tokens.scheme)
  const cache = properties.hasCache('focus', false, tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token(boolean array) resolve', () => {
  const rule = properties.compute('focus', [true, false], tokens.scheme)
  const cache = properties.hasCache('focus', [true, false], tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token resolve (deep array)', () => {
  const rule = properties.compute('fontSize', ['s', 'm', 'l'], tokens.scheme)
  const cache = properties.hasCache('fontSize', ['s', 'm', 'l'], tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token resolve (deep array nullish)', () => {
  const rule = properties.compute('fontSize', ['s', , 'l'], tokens.scheme)
  const cache = properties.hasCache('fontSize', ['s', , 'l'], tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})