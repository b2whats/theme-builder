import { Tokens } from './tokens'
import type { Slot } from './ThemeBuilder'

interface TextProperties {
  /* Семейство шрифта */
  fontFamily?: string
  /* Размер шрифта */
  fontSize?: keyof Tokens['font']['fontSize'] | number | (string & {})
  /* Высота текстовой строки */
  lineHeight?: keyof Tokens['font']['lineHeight'] | 'inherit' | number
  /* Межбуквенный интервал */
  letterSpacing?: number
  /* Начертание шрифта */
  fontWeight?: 'light' | 'normal' | 'bold' | number
  /* Курсив */
  italic?: boolean
  /* Текст в одну строку */
  noWrap?: boolean
  /* Многострочный текст */
  wrap?: boolean
  /* Сохранить форматирование текста */
  pre?: boolean
  /* Текст заглавными буквами */
  uppercase?: boolean
  /* Троеточие в конце текста */
  truncate?: boolean
  /* Контейнер текста по высоте строчных букв */
  crop?: boolean
  /* Сглаживание шрифта */
  smoothing?: 'auto' | 'antialiased' | 'subpixel'
}

interface DimensionProperties {
  /* Ширина блока */
  width?: number | string
  /* Максимальная ширина блока */
  maxWidth?: number | string
  /* Минимальная ширина блока */
  minWidth?: number | string
  /* Высота блока */
  height?: keyof Tokens['dimension']['rowHeight'] | 'auto' | number | (string & {})
  /* Минимальная высота блока */
  minHeight?: keyof Tokens['dimension']['rowHeight'] | 'auto' | number | (string & {})
  /* Максимальная высота блока */
  maxHeight?: keyof Tokens['dimension']['rowHeight'] | 'auto' | number | (string & {})
  /* Уменьшать при нехватке пространства */
  shrink?: boolean
  /* Занять все возможзное пространство */
  grow?: boolean
}

interface VisibilityProperties {
  /* Видимость блока */
  visible?: boolean
  /* Прозрачность блока */
  opacity?: number
}

type SpaceValues = keyof Tokens['space'] | 'auto' | number

interface MarginProperties {
  /* Внешний отступ со всех сторон */
  m?: SpaceValues
  /* Внешний отступ слева и справа */
  mx?: SpaceValues
  /* Внешний отступ сверху и снизу */
  my?: SpaceValues
  /* Внешний отступ сверху */
  mt?: SpaceValues
  /* Внешний отступ справа */
  mr?: SpaceValues
  /* Внешний отступ снизу */
  mb?: SpaceValues
  /* Внешний отступ слева */
  ml?: SpaceValues
}

interface PaddingProperties {
  /* Внутренний отступ */
  p?: SpaceValues
  /* Внутренний отступ слева и справа */
  px?: SpaceValues
  /* Внутренний отступ сверху и снизу */
  py?: SpaceValues
  /* Внутренний отступ сверху */
  pt?: SpaceValues
  /* Внутренний отступ справа */
  pr?: SpaceValues
  /* Внутренний отступ снизу */
  pb?: SpaceValues
  /* Внутренний отступ слева */
  pl?: SpaceValues
}

type Align = 'left' | 'center' | 'right' | 'justify'
type Valign = 'top' | 'middle' | 'bottom' | 'baseline' | 'stretch'

interface LayoutProperties {
  /* Тип отображения элемента */
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex'
  /* Вертикальное направление дочерних элементов */
  column?: boolean
  /* Блочное поведение */
  block?: boolean
  /* Строчное поведение */
  inline?: boolean
  /* Горизонтальное выравнивание дочерних блоков */
  align?: Align
  /* Горизонтальное выравнивание */
  alignSelf?: Align
  /* Вертикальное выравнивание */
  valignSelf?: Valign
  /* Вертикальное выравнивание дочерних блоков */
  valign?: Valign
  /* Переносить блоки на следующие строки если не хватило места */
  wrap?: boolean
  /* Положение элемента в потоке */
  position?: 'relative' | 'absolute' | 'static' | 'fixed'
  /* Расстояние от верхнего края */
  top?: number
  /* Расстояние от нижнего края */
  bottom?: number
  /* Расстояние от левого края */
  left?: number
  /* Расстояние от правого края */
  right?: number
  /* Добавляет скролл */
  scroll?: boolean
  /* Порядок элементов */
  order?: number
  /* Отображение контента за пределами элемента */
  overflow?: 'hidden' | 'visible' | 'scroll' | 'auto'
}

type BorderStyle = 'solid' | 'dotted' | 'dashed' | 'none'

interface BorderProperties {
  /* Стиль границ */
  borderStyle?: BorderStyle
  /* Радиус границ */
  borderRadius?: keyof Tokens['dimension']['borderRadius'] | 'circle' | number
  /* Ширина границы */
  borderWidth?: number
  /* Ширина верхней границы */
  borderTopWidth?: number
  /* Ширина правой границы */
  borderRightWidth?: number
  /* Ширина нижней границы */
  borderBottomWidth?: number
  /* Ширина левой границы */
  borderLeftWidth?: number
  /* Стиль верхней границы */
  borderTopStyle?: BorderStyle
  /* Стиль правой границы */
  borderRightStyle?: BorderStyle
  /* Стиль нижней границы */
  borderBottomStyle?: BorderStyle
  /* Стиль левой границы */
  borderLeftStyle?: BorderStyle
}

interface OtherProperties {
  /* Сделать элемент фокусируемым */
  focus?: boolean
  /* Цветовая схема элемента */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  /* Соседний селектор */
  adjacentSelector?: string
  /* Форма фигуры */
  shape?: 'pill' | 'square' | 'circle'
  /* Тень */
  shadow?: keyof Tokens['shadow'] | (string & {})
  /* Внешний вид курсора над элементом */
  cursor?: string
  /* Разрешить выделение */
  userSelect?: boolean
  /* Тестовый идентификатор */
  marker?: string
  /* Позиция элемента по оси Z */
  zIndex?: keyof Tokens['zIndex'] | number
  // Анимация
  transition?: keyof Tokens['transition']
}

type Colors = keyof Tokens['palette'] | 'transparent'

interface ColorProperties {
  /* Цвет контента */
  color?: Colors
  /* Цвет фона */
  bg?: Colors
  /* Цвет ганиц */
  borderColor?: Colors
  /* Цвет текста у плейсхолдера */
  placeholderColor?: Colors
}

export interface StyleProperties extends
  TextProperties,
  DimensionProperties,
  PaddingProperties,
  MarginProperties,
  BorderProperties,
  ColorProperties,
  OtherProperties,
  VisibilityProperties,
  LayoutProperties {}

export interface StateSelectors {
  /* Состояние не активного элемента */
  disabled?: Partial<StyleProperties>
  /* Состояние наведения */
  hover?: Partial<StyleProperties>
  /* Состояние нажатия */
  active?: Partial<StyleProperties>
  /* Состояние посещенного элемента */
  visited?: Partial<StyleProperties>
  /* Состояние в выбранном состоянии */
  checked?: Partial<StyleProperties>
}

const states = {
  checked: '&:checked, &[aria-checked=true]',
  visited: '&:visited',
  hover: '&:hover',
  active: '&:not(:disabled):active',
  disabled: '&:disabled, &[aria-disabled=true]',
}
const stateSelectors = (state: string, value: string) => `${states[state]}{${value}}`

type StyleFn = (value: any, params: StyleProperties, tokens: Tokens) => string
const fontFamily: StyleFn = (value) => `font-family: ${value};`
const fontSize: StyleFn = (value, _, { font }) => `font-size: ${font.fontSize[value] || value}px;`
const lineHeight: StyleFn = (value, _, { font }) => `line-height: ${font.lineHeight[value] || value};`
const letterSpacing: StyleFn = (value) => `letter-spacing: ${value}px;`
const fontWeight: StyleFn = (value) => `font-weight: ${value};`
const italic: StyleFn = (value) => `font-style: ${value ? 'italic' : 'normal'};`
const noWrap: StyleFn = (value) => `white-space: ${value ? 'nowrap' : 'normal'};`
const pre: StyleFn = (value) => `white-space: ${value ? 'pre-wrap' : 'normal'};`
const wrap: StyleFn = () => 'flex-wrap: wrap; word-break: break-all;'
const uppercase: StyleFn = (value) => `text-transform: ${value ? 'uppercase' : 'none'};`
const cursor: StyleFn = (value) => value ? `cursor: ${value};` : ''
const truncate: StyleFn = () => `
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: normal;
  overflow: hidden;
`
const webkitSmoothing = { auto: 'auto', antialiased: 'antialiased', subpixel: 'subpixel-antialiased' }
const mozSmoothing = { auto: 'auto', antialiased: 'grayscale', subpixel: 'grayscale' }
const smoothing: StyleFn = (value) => `
  -webkit-font-smoothing: ${webkitSmoothing[value]};
  -moz-osx-font-smoothing: ${mozSmoothing[value]};
`
const spaceValue = (value: string | number, spaces: {}): string => {
  if (typeof value === 'number') {
    return Math.abs(value) > 0.99 ? `${value}px` : `${value * 100}%`
  }

  return spaces[value] ? `${spaces[value]}px` : value
}
const space: (property: string) => StyleFn = (property) => (value, _, { space }) => `${property}: ${spaceValue(value, space)};`

function execDimension(size: number | string) {
  if (typeof size === 'number') {
    return Math.abs(size) > 1 ? `${size}px` : `${size * 100}%`
  }

  return size
}
const dimensionHeight: (property: string) => StyleFn = (property) => (value, _, { dimension }) => `${property}: ${execDimension(dimension.rowHeight[value] || value)};`
const dimensionWidth: (property: string) => StyleFn = (property) => (value) => `${property}: ${execDimension(value)};`
const width: StyleFn = (value, params, { dimension, space }) => {
  let width = ''

  if (value) {
    width = execDimension(value)
  } else if (params.shape === 'circle' || params.shape === 'square') {
    const targetHeight = params.height || params.minHeight
    if (targetHeight) {
      width = execDimension(dimension.rowHeight[targetHeight] || targetHeight)
    }
  }

  if (width.endsWith('%') && (params.ml || params.mr)) {
    width = `calc(${width} - ${params.ml && params.ml !== 'auto' ? spaceValue(params.ml, space) : '0px'} - ${params.mr && params.mr !== 'auto' ? spaceValue(params.mr, space) : '0px'})`
  }

  return `width: ${width};`
}
const grow: StyleFn = (value) => `flex-grow: ${value ? '1' : '0'};`
const shrink: StyleFn = (value) => `flex-shrink: ${value ? '1' : '0'};`
const order: StyleFn = (value) => `order: ${value};`
const borderWidth: StyleFn = (value, params) => `border-width: ${value}px;${params.borderStyle ? '' : 'border-style: solid;'}`
const borderTopWidth: StyleFn = (value, params) => `border-top-width: ${value}px;${params.borderStyle || params.borderTopStyle ? '' : 'border-style: solid;'}`
const borderRightWidth: StyleFn = (value, params) => `border-right-width: ${value}px;${params.borderStyle || params.borderRightStyle ? '' : 'border-style: solid;'}`
const borderBottomWidth: StyleFn = (value, params) => `border-bottom-width: ${value}px;${params.borderStyle || params.borderBottomStyle ? '' : 'border-style: solid;'}`
const borderLeftWidth: StyleFn = (value, params) => `border-left-width: ${value}px;${params.borderStyle || params.borderLeftStyle ? '' : 'border-style: solid;'}`
const borderStyle: StyleFn = (value) => `border-style: ${value};`
const borderTopStyle: StyleFn = (value) => `border-top-style: ${value};`
const borderRightStyle: StyleFn = (value) => `border-right-style: ${value};`
const borderBottomStyle: StyleFn = (value) => `border-bottom-style: ${value};`
const borderLeftStyle: StyleFn = (value) => `border-left-style: ${value};`


const borderRadius: StyleFn = (value, params, { dimension }) => params.shape === 'circle' || params.shape === 'pill'
  ? ''
  : `border-radius: ${value === 'circle' ? '100' : dimension.borderRadius[value] || value}px;`

const alignColumn = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  justify: 'stretch',
}
const alignDisplay= {
  block: 'text-align',
  inline: 'text-align',
  'inline-block': 'text-align',
  'flex': 'justify-content',
  'inline-flex': 'justify-content',
}
const justifyContent = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  justify: 'space-between',
}
const align: StyleFn = (value, params) => {
  if (!params.display) return ''

  let prop

  if (params.column) {
    prop = 'align-items'
    value = alignColumn[value]
  } else {
    prop = alignDisplay[params.display]

    if (prop === 'justify-content') {
      value = justifyContent[value]
    }
  }

  return `${prop}: ${value};`
}

const valignColumn = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  justify: 'space-between',
}
const alignFlex = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
}
const valign: StyleFn = (value, params) => params.column
  ? `justify-content: ${valignColumn[value]};`
  : `align-items: ${alignFlex[value]};`

const verticalAlign = {
  top: 'top',
  middle: 'middle',
  bottom: 'bottom',
  baseline: 'baseline',
  stretch: 'baseline',
}
const valignSelf: StyleFn = (value) => `align-self: ${alignFlex[value]};vertical-align: ${verticalAlign[value]};`
const alignSelf: StyleFn = (value) => `align-self: ${alignColumn[value]};`
const column: StyleFn = () => 'flex-direction: column;'
const color: StyleFn = (value, _, { palette }) => `color: ${palette[value] || value};`
const bg: StyleFn = (value, _, { palette }) => `background-color: ${palette[value] || value};`
const borderColor: StyleFn = (value, _, { palette }) => `border-color: ${palette[value] || value};`
const placeholderColor: StyleFn = (value, _, { palette }) => `&::placeholder, & *::placeholder {color: ${palette[value] || value};-webkit-text-fill-color: currentcolor;}`
const position: StyleFn = (value) => `position: ${value};`
const top: StyleFn = (value) => `top: ${execDimension(value)};`
const right: StyleFn = (value) => `right: ${execDimension(value)};`
const bottom: StyleFn = (value) => `bottom: ${execDimension(value)};`
const left: StyleFn = (value) => `left: ${execDimension(value)};`
const overflow: StyleFn = (value) => `overflow: ${value};`
const visible: StyleFn = (value) => `visibility: ${value ? 'visible' : 'hidden'};`
const opacity: StyleFn = (value) => `opacity: ${value};`
const focus: StyleFn = (value, __, { focus }) => `
  outline: none;
  
  ${value ? `
    &&:focus{
      box-shadow: ${focus};
      position: relative;
      z-index: 2;
    }
  ` : ''}
`
const disabled: StyleFn = (value) => value ? `pointer-events: none;` : ''
const shape: StyleFn = (value) => 
  value === 'circle' ? 'border-radius: 50%;' :
  value === 'pill' ? 'border-radius: 100px;' :
  ''
const shadow: StyleFn = (value, _, { shadow }) => `box-shadow: ${shadow[value]};`
const zIndex: StyleFn = (value, _, { zIndex }) => `z-index: ${zIndex[value] || zIndex};`
const userSelect: StyleFn = (value) => `user-select: ${value ? 'auto' : 'none'};`
const transition: StyleFn = (value, _, { transition }) => value ? `transition: all ${transition[value]};` : ''

const inline = {
  block: 'inline-block',
  inline: 'inline-block',
  'inline-block': 'inline-block',
  'flex': 'inline-flex',
  'inline-flex': 'inline-flex',
}
const block = {
  block: 'block',
  inline: 'block',
  'inline-block': 'block',
  'flex': 'flex',
  'inline-flex': 'flex',
}
const display: StyleFn = (value, params) => {
  let result = value

  if (params.crop || params.truncate) {
    result = 'inline-block'
  }
  if (params.inline) {
    result = inline[value]
  }
  if (params.block) {
    result = block[value]
  }

  return `display: ${result};`
}

const stylesMap = {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight,
  italic,
  noWrap,
  pre,
  wrap,
  uppercase,
  cursor,
  truncate,
  smoothing,
  height: dimensionHeight('height'),
  minHeight: dimensionHeight('min-height'),
  maxHeight: dimensionHeight('max-height'),
  width,
  minWidth: dimensionWidth('min-widthh'),
  maxWidth: dimensionWidth('max-width'),
  grow,
  shrink,
  order,
  borderWidth,
  borderTopWidth,
  borderRightWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderStyle,
  borderTopStyle,
  borderRightStyle,
  borderBottomStyle,
  borderLeftStyle,
  borderRadius,
  align,
  alignSelf,
  valign,
  valignSelf,
  column,
  color,
  bg,
  borderColor,
  placeholderColor,
  position,
  top,
  right,
  bottom,
  left,
  overflow,
  visible,
  opacity,
  focus,
  disabled,
  shape,
  shadow,
  zIndex,
  userSelect,
  transition,
  display,
  pt: space('padding-top'),
  pr: space('padding-right'),
  pb: space('padding-bottom'),
  pl: space('padding-left'),
  mt: space('margin-top'),
  mr: space('margin-right'),
  mb: space('margin-bottom'),
  ml: space('margin-left'),
}

export const objectStyleToString = (props: any, tokens: Tokens, params: Slot): string => {
  let result = 'box-sizing: border-box;'

  for (let prop in params) {
    let propValue = params[prop]

    if (typeof propValue === 'function') {
      propValue = propValue(props)
    }

    if ((['disabled', 'hover', 'active', 'visited', 'checked']).includes(prop)) {
      result += stateSelectors(prop, objectStyleToString(props, tokens, propValue))
    }

    if (typeof stylesMap[prop] === 'function' && propValue != null) {
      result += stylesMap[prop](propValue, params, tokens)
    }
  }

  return result
}