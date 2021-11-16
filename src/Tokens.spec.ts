import { tokens } from './fixtures'

test('Tokens', () => {
  expect(tokens).toMatchSnapshot()
})