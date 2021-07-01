import { DesignSystem } from './DesignSystem'

const tokens = {
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  font: {
    fontSize: {
      xxxxxl: 0,
      xxxxl: 0,
      xxxl: 0,
      xxl: 36,
      xl: 26,
      l: 22,
      m: 16,
      s: 13,
      xs: 11,
    },

    lineHeight: {
      none: 1.12,
      normal: 1.375,
      dense: 1.25,
    },
  },
  palette: {
    red50: 'red'
  },
  space: {
    xxxl: 40,
    xxl: 32,
    xl: 24,
    l: 20,
    m: 16,
    s: 12,
    xs: 8,
    xxs: 4,
    xxxs: 2,
  },

  shadow: {
    1: '',
    2: '',
    3: '',
    4: '',
  },

  breakpoint: ['40em', '52em', '64em', '80em']
} as const

test('DesignSystem - tokens', () => {
  const theme = new DesignSystem()
    .token(tokens)

  expect(theme.getTokenPaths()).toMatchSnapshot()
})

test('DesignSystem - tokens with brandToken object', () => {
  const theme = new DesignSystem()
    .token(tokens)
    .brandToken({
      primaryColor: 'red'
    })

  expect(theme.getTokenPaths()).toMatchSnapshot()
})

test('DesignSystem - tokens with brandToken fn', () => {
  const theme = new DesignSystem()
    .token(tokens)
    .brandToken((tokens) => ({
      primaryColor: tokens.palette.red50
    }))

  expect(theme.getTokenPaths()).toMatchSnapshot()
})