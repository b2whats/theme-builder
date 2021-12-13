import { properties, tokens } from './fixtures'

test('Properties compute - without token', () => {
  const rule = properties.compute('display', 'block', tokens.scheme)
  const cache = properties.hasCache('display', 'block', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token resolve non nullish value', () => {
  const rule = properties.compute('opacity', 'minLevel', tokens.scheme)
  const cache = properties.hasCache('color', 'black', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token resolve', () => {
  const rule = properties.compute('opacity', 'minLevel', tokens.scheme)
  const cache = properties.hasCache('color', 'black', tokens.scheme)

  expect(cache).toBe(true)
  expect(rule).toMatchSnapshot()
})

test('Properties compute - with token no resolve', () => {
  const rule = properties.compute('colorHEX', '#hex', tokens.scheme)
  const cache = properties.hasCache('colorHEX', '#hex', tokens.scheme)

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