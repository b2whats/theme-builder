import { Tokens } from './Tokens'

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
  /* Жирное начертание шрифта */
  bold?: boolean
  /* Тонкое начертание шрифта */
  light?: boolean
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
  /* Реакция элемента на события мыши */
  pointerEvents?: boolean
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