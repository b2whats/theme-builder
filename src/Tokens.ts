type Font = {
  fontFamily: string
  color: keyof Palette
  smoothing?: 'auto' | 'antialiased' | 'subpixel'
  
  fontSize: {
    xxxxxl: number
    xxxxl: number
    xxxl: number
    xxl: number
    xl: number
    l: number
    m: number
    s: number
    xs: number
  }
  
  lineHeight: {
    none: number
    normal: number
    dense: number
  }
}
  
type Palette = {
  blue50: string
  blue100: string
  blue200: string
  blue300: string
  blue400: string
  blue500: string
  blue600: string
  blue700: string
  blue800: string
  blue900: string

  green50: string
  green100: string
  green200: string
  green300: string
  green400: string
  green500: string
  green600: string
  green700: string
  green800: string
  green900: string

  red50: string
  red100: string
  red200: string
  red300: string
  red400: string
  red500: string
  red600: string
  red700: string
  red800: string
  red900: string

  yellow50: string
  yellow100: string
  yellow200: string
  yellow300: string
  yellow400: string
  yellow500: string
  yellow600: string
  yellow700: string
  yellow800: string
  yellow900: string

  purple50: string
  purple100: string
  purple200: string
  purple300: string
  purple400: string
  purple500: string
  purple600: string
  purple700: string
  purple800: string
  purple900: string

  orange50: string
  orange100: string
  orange200: string
  orange300: string
  orange400: string
  orange500: string
  orange600: string
  orange700: string
  orange800: string
  orange900: string

  gray4: string
  gray8: string
  gray12: string
  gray16: string
  gray20: string
  gray24: string
  gray28: string
  gray32: string
  gray36: string
  gray40: string
  gray44: string
  gray48: string
  gray52: string
  gray56: string
  gray60: string
  gray64: string
  gray68: string
  gray72: string
  gray76: string
  gray80: string
  gray84: string
  gray88: string
  gray92: string
  gray96: string

  black: string
  black4: string
  black8: string
  black12: string
  black16: string
  black20: string
  black24: string
  black28: string
  black32: string
  black36: string
  black40: string
  black44: string
  black48: string
  black52: string
  black56: string
  black60: string
  black64: string
  black68: string
  black72: string
  black76: string
  black80: string
  black84: string
  black88: string
  black92: string
  black96: string

  white: string
}
  
type Dimension = {
  rowHeight: {
    l: number
    m: number
    s: number
  }
  borderRadius: {
    l: number
    m: number
    s: number
  }
}
  
type Space = {
  xxxl: number
  xxl: number
  xl: number
  l: number
  m: number
  s: number
  xs: number
  xxs: number
  xxxs: number
}

type Shadow = {
  1: string
  2: string
  3: string
  4: string
}

type zIndex = {
  tooltip: number
  popup: number
  dropdown: number
}

type Transition = {
  fade: string
}

type Breakpoint = string[]
  
export type Tokens = {
  focus: string
  font: Font
  palette: Palette
  dimension: Dimension
  space: Space
  shadow: Shadow
  zIndex: zIndex
  transition: Transition
  breakpoint: Breakpoint
}