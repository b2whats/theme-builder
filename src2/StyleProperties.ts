import type { Tokens } from './tokens'
import type { Slot } from './ThemeBuilder'
import { weakMemoize } from './merge'
import { isObject, get } from './utils'
import { Properties } from './StyleProperties2'
import { cellx } from 'cellx' 

interface TextProperties {
  /* Семейство шрифта */
  fontFamily: string
  /* Размер шрифта */
  fontSize: keyof Tokens['font']['fontSize'] | number | (string & {})
  /* Высота текстовой строки */
  lineHeight: keyof Tokens['font']['lineHeight'] | 'inherit' | number
  /* Межбуквенный интервал */
  letterSpacing: number
  /* Начертание шрифта */
  fontWeight: 'light' | 'normal' | 'bold' | number
  /* Курсив */
  italic: boolean
  /* Текст в одну строку */
  noWrap: boolean
  /* Многострочный текст */
  wrap: boolean
  /* Сохранить форматирование текста */
  pre: boolean
  /* Текст заглавными буквами */
  uppercase: boolean
  /* Троеточие в конце текста */
  truncate: boolean
  /* Контейнер текста по высоте строчных букв */
  crop: boolean
  /* Сглаживание шрифта */
  smoothing: 'auto' | 'antialiased' | 'subpixel'
}

interface DimensionProperties {
  /* Ширина блока */
  width: number | string
  /* Максимальная ширина блока */
  maxWidth: number | string
  /* Минимальная ширина блока */
  minWidth: number | string
  /* Высота блока */
  height: keyof Tokens['dimension']['rowHeight'] | 'auto' | number | (string & {})
  /* Минимальная высота блока */
  minHeight: keyof Tokens['dimension']['rowHeight'] | 'auto' | number | (string & {})
  /* Максимальная высота блока */
  maxHeight: keyof Tokens['dimension']['rowHeight'] | 'auto' | number | (string & {})
}

interface EffectProperties {
  /* Видимость блока */
  visible: boolean
  /* Прозрачность */
  opacity: number
  /* Тень */
  shadow: keyof Tokens['shadow'] | (string & {})
  /* Анимация */
  transition: keyof Tokens['transition']
}

type SpaceValues = keyof Tokens['space'] | 'auto' | number

interface MarginProperties {
  /* Внешний отступ со всех сторон */
  m: SpaceValues
  /* Внешний отступ слева и справа */
  mx: SpaceValues
  /* Внешний отступ сверху и снизу */
  my: SpaceValues
  /* Внешний отступ сверху */
  mt: SpaceValues
  /* Внешний отступ справа */
  mr: SpaceValues
  /* Внешний отступ снизу */
  mb: SpaceValues
  /* Внешний отступ слева */
  ml: SpaceValues
}

interface PaddingProperties {
  /* Внутренний отступ */
  p: SpaceValues
  /* Внутренний отступ слева и справа */
  px: SpaceValues
  /* Внутренний отступ сверху и снизу */
  py: SpaceValues
  /* Внутренний отступ сверху */
  pt: SpaceValues
  /* Внутренний отступ справа */
  pr: SpaceValues
  /* Внутренний отступ снизу */
  pb: SpaceValues
  /* Внутренний отступ слева */
  pl: SpaceValues
}

type Align = 'left' | 'center' | 'right' | 'justify'
type Valign = 'top' | 'middle' | 'bottom' | 'baseline' | 'stretch'

interface LayoutProperties {
  /* Тип отображения элемента */
  display: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex'
  /* Вертикальное направление дочерних элементов */
  column: boolean
  /* Растягивается на всю ширину */
  stretch: boolean
  /* Горизонтальное выравнивание дочерних блоков */
  align: Align
  /* Горизонтальное выравнивание */
  alignSelf: Align
  /* Вертикальное выравнивание */
  valignSelf: Valign
  /* Вертикальное выравнивание дочерних блоков */
  valign: Valign
  /* Переносить блоки на следующие строки если не хватило места */
  wrap: boolean
  /* Положение элемента в потоке */
  position: 'relative' | 'absolute' | 'static' | 'fixed'
  /* Расстояние от верхнего края */
  top: number
  /* Расстояние от нижнего края */
  bottom: number
  /* Расстояние от левого края */
  left: number
  /* Расстояние от правого края */
  right: number
  /* Порядок элементов */
  order: number
  /* Уменьшать при нехватке пространства */
  shrink: boolean
  /* Занять все возможзное пространство */
  grow: boolean
  /* Отображение контента за пределами элемента */
  overflow: 'hidden' | 'visible' | 'scroll' | 'auto'
  /* Позиция элемента по оси Z */
  zIndex: keyof Tokens['zIndex'] | number
}

type BorderStyle = 'solid' | 'dotted' | 'dashed' | 'none'

interface BorderProperties {
  /* Стиль границ */
  borderStyle: BorderStyle
  /* Радиус границ */
  borderRadius: keyof Tokens['dimension']['borderRadius'] | 'circle' | number
  /* Ширина границы */
  borderWidth: number
  /* Ширина верхней границы */
  borderTopWidth: number
  /* Ширина правой границы */
  borderRightWidth: number
  /* Ширина нижней границы */
  borderBottomWidth: number
  /* Ширина левой границы */
  borderLeftWidth: number
  /* Стиль верхней границы */
  borderTopStyle: BorderStyle
  /* Стиль правой границы */
  borderRightStyle: BorderStyle
  /* Стиль нижней границы */
  borderBottomStyle: BorderStyle
  /* Стиль левой границы */
  borderLeftStyle: BorderStyle
  /* Форма фигуры */
  shape: 'pill' | 'square' | 'circle'
}

interface InteractiveProperties {
  /* Сделать элемент фокусируемым */
  focus: boolean
  /* Внешний вид курсора над элементом */
  cursor: string
  /* Разрешить выделение */
  userSelect: boolean
  /* Реакция элемента на события */
  pointerEvents: boolean
}

interface OtherProperties {
  /* Цветовая схема элемента */
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  /* Соседний селектор */
  adjacentSelector: string
  /* Тестовый идентификатор */
  marker: string
  /* Тег элемента */
  as: keyof JSX.IntrinsicElements
}

type Colors = keyof Tokens['palette'] | 'transparent'

interface ColorProperties {
  /* Цвет контента */
  color: Colors
  /* Цвет фона */
  bg: Colors
  /* Цвет ганиц */
  borderColor: Colors
  /* Цвет текста у плейсхолдера */
  placeholderColor: Colors
}

type Responsive<T extends object> = {
  [Key in keyof T]?: T[Key] | (T[Key] | null)[]
}

// type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
// type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

// type Tuple9<T> = Tuple<T, 9>;
// type Board9x9<P> = Tuple9<Tuple9<P>>;

interface Properties extends
  TextProperties,
  DimensionProperties,
  PaddingProperties,
  MarginProperties,
  BorderProperties,
  ColorProperties,
  EffectProperties,
  LayoutProperties,
  InteractiveProperties {}

export interface StyleProperties extends
  Responsive<Properties>,
  Partial<OtherProperties> {}

export interface StateSelectors {
  /* Состояние не активного элемента */
  disabled?: Partial<Properties>
  /* Состояние наведения */
  hover?: Partial<Properties>
  /* Состояние нажатия */
  active?: Partial<Properties>
  /* Состояние посещенного элемента */
  visited?: Partial<Properties>
  /* Состояние выбора */
  checked?: Partial<Properties>
}

const states = {
  checked: '&:checked, &[aria-checked=true]',
  visited: '&:visited',
  hover: '&:hover',
  active: '&:not(:disabled):active',
  disabled: '&:disabled, &[aria-disabled=true], &[disabled]',
}

type StyleFn = (value: any, params: Partial<Properties>, tokens: Tokens) => string
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
const focus: StyleFn = (value, _, { focus }) => `
  outline: none;
  
  ${value ? `
    &&:focus{
      box-shadow: ${focus};
      position: relative;
      z-index: 2;
    }
  ` : ''}
`
const pointerEvents: StyleFn = (value) => value ? `pointer-events: ${value};` : ''
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
  if (params.stretch === true) {
    result = block[value]
  }
  if (params.stretch === false) {
    result = inline[value]
  }

  return `display: ${result};`
}

type ExcludedStyles = 'p' | 'px' | 'py' | 'm' | 'mx' | 'my' | 'stretch' | 'variant' | 'marker' | 'adjacentSelector' | 'crop' | 'as'

type ExcludedStyles1 =
  | 'p'
  | 'px' 
  | 'py' 
  | 'm' 
  | 'mx' 
  | 'my' 
  | 'stretch' 
  | 'variant' 
  | 'marker' 
  | 'adjacentSelector' 
  | 'crop' 
  | 'as'




type StyleMap = {
  [key in Exclude<keyof StyleProperties, ExcludedStyles>]-?: StyleFn
}

const stylesMap: StyleMap = {
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
  pointerEvents,
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

const shortHands = {
  m: (value: any) => ({ mt: value, mr: value, mb: value, ml: value }),
  mx: (value: any) => ({ mr: value, ml: value }),
  my: (value: any) => ({ mt: value, mb: value }),
  p: (value: any) => ({ pt: value, pr: value, pb: value, pl: value }),
  px: (value: any) => ({ pr: value, pl: value }),
  py: (value: any) => ({ pt: value, pb: value }),
}

export function expandShorthands<T>(
  styles: T
): T {
  let results = {} as T

  if (!isObject(styles)) return styles

  for (let [key, value] of Object.entries(styles)) {
    if (shortHands[key]) {
      Object.assign(results, shortHands[key](value))

      continue
    }
    if (states[key]) {
      results[key] = expandShorthands(value)
    }

    results[key] = value
  }

  return results
}

const createCacheWithBreakpoint = weakMemoize((breakpoint: string[]) => {
  return breakpoint.map((value) => `@media screen and (min-width: ${value})`)
})


export const objectStyleToString = (props: any, tokens: Tokens, params: Slot): string => {
  let result = 'box-sizing: border-box;'
  const responsive: string[] = []
  const breakpoint = createCacheWithBreakpoint(tokens.breakpoint)

  for (let prop in params) {
    let propValue = params[prop]

    if (typeof propValue === 'function') {
      propValue = propValue(props)
    }

    if (states[prop]) {
      result += `${states[prop]}{${objectStyleToString(props, tokens, propValue)}}`
    }
    // перенести проверку вверх могут быть пропы функции
    if (typeof stylesMap[prop] === 'function' && propValue != null) {
      if (Array.isArray(propValue)) {
        propValue.forEach((value, i) => {
          if (value !== null) {
            responsive[i] = (responsive[i] || '') + stylesMap[prop](value, params, tokens)
          }
        })
      } else {
        result += stylesMap[prop](propValue, params, tokens)
      }
    }
  }

  if (responsive.length) {
    responsive.forEach((value, i) => {
      result += i === 0 ? value : `${breakpoint[i - 1]}{${value}}`
    })
  }

  return result
}

export const objectStyleToString3 = (props: any, tokens: Tokens, params: Slot): string => {
  const breakpoint = createCacheWithBreakpoint(tokens.breakpoint)
  let responsive = Array.from(tokens.breakpoint, () => ({}));

  for (let property in params) {
    let propValue = params[property]

    if (typeof propValue === 'function') {
      propValue = propValue(props)
    }

    if (typeof stylesMap[property] === 'function' && propValue != null) {
      if (Array.isArray(propValue)) {
        propValue.forEach((value, i) => {
          if (value !== null) {
            responsive[i][property] = value
          }
        })
      } else {
        responsive[0][property] = propValue
      }
    }
  }

  let result = 'box-sizing: border-box;'

  responsive.forEach((properties, i) => {
    let str = ''
    for (let property in properties) {
      if (properties.hasOwnProperty(property)) {
        str += stylesMap[property](properties[property], responsive[i], tokens)
      }
    }

    if (i === 0) {
      result += str
    } else {
      result += `${breakpoint[i - 1]}{${str}}`
    }
  })
  return result
}

// export const objectStyleToString2 = (props: any, tokens: Tokens, properties: Slot): string => {
//   let responsive = Array.from(tokens.breakpoint, () => ({}));

//   for (let property in properties) {
//     let propValue = properties[property]

//     if (typeof propValue === 'function') {
//       propValue = propValue(props)
//     }

//     if (states[property]) {
//       responsive[0][property] = propValue
//       continue
//     }

//     if (typeof Properties.properties[property] === 'function' && propValue != null) {
//       if (Array.isArray(propValue)) {
//         propValue.forEach((value, i) => {
//           if (value !== null) {
//             responsive[i][property] = Properties.properties[property].getTokenValue(tokens) || value
//           }
//         })
//       } else {
//         responsive[0][property] = Properties.properties[property].getTokenValue(tokens) || propValue
//       }
//     }
//   }

//   let result = 'box-sizing: border-box;'
//   const breakpoint = createCacheWithBreakpoint(tokens.breakpoint)

//   responsive.forEach((properties, i) => {
//     let str = ''
//     for (let property in properties) {
//       str += Properties.properties[property](properties[property], tokens, properties)
//     }

//     if (i === 0) {
//       result += str
//     } else {
//       result += `${breakpoint[i - 1]}{${str}}`
//     }
//   })

//   return result
// }



export const objectStyleToString11 = (props: any, tokens: Tokens, params: Slot): string => {
  let result = 'box-sizing: border-box;'
  const responsive: string[] = []
  const breakpoint = createCacheWithBreakpoint(tokens.breakpoint)

  for (let prop in params) {
    let propValue = params[prop]

    if (typeof propValue === 'function') {
      propValue = propValue(props)
    }

    if (states[prop]) {
      result += `${states[prop]}{${objectStyleToString(props, tokens, propValue)}}`
    }
    // перенести проверку вверх могут быть пропы функции
    const fn = Properties.get(prop as any)
    if (fn && propValue != null) {
      if (Array.isArray(propValue)) {
        propValue.forEach((value, i) => {
          if (value !== null) {
            responsive[i] = (responsive[i] || '') + fn(value, tokens)
          }
        })
      } else {
        result += fn(propValue, tokens)
      }
    }
  }
  if (responsive.length) {
    responsive.forEach((value, i) => {
      result += i === 0 ? value : `${breakpoint[i - 1]}{${value}}`
    })
  }

  return result
}