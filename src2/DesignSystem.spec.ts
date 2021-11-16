import { DesignSystem } from './DesignSystem'

const tokens = {
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  font: {
    fontSize: {
      l: 22,
      m: 16,
      s: 13,
    },

    lineHeight: {
      none: 1.12,
      normal: 1.375,
      dense: 1.25,
    },
  },
  palette: {
    red50: 'red50'
  },

  space: {
    l: 20,
    m: 16,
    s: 12,
  },

  breakpoint: {
    small: '40',
    big: '40',
  }
}

const brandToken = {
  primary: 'red',
  secondary: 'palette.red50'
}

test('DesignSystem - tokens', () => {
  const theme = new DesignSystem()
    .baseTokens(tokens)

  expect(theme.getTokens()).toMatchSnapshot()
})

test('DesignSystem - tokens with brandToken object', () => {
  const theme = new DesignSystem()
    .baseTokens(tokens)
    .brandTokens({
      ss: 1,
      ss1: '4343',
      dd: {
        ff: 'dwdw'
      }
    })


  expect(theme.getTokens()).toMatchSnapshot()
})