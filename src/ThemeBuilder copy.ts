import { StyleProperties, StateSelectors } from './StyleProperties'
import { Tokens } from './Tokens'

type PartialStyleProperties<U> = U extends StyleProperties
  ? Partial<U>
  : U extends (...args: infer A) => infer R
    ? (...args: A) => PartialStyleProperties<R>
    : U
type MaybeArray<Item> = [Item, ...PartialStyleProperties<Item>[]] | Item
export type Slot<Props = StyleProperties> = Props

export type ComponentTheme<Props, Scheme extends { [key: string]: Slot<any> }> = {
  defaultProps?: Partial<Props>
  mapProps?: (props: Props) => Partial<Props> | void
  slots: {
    [K in keyof Scheme]?: MaybeArray<Parts<Props, Scheme[K]>>
  }
}

type ThemeConfig<Theme extends ComponentTheme<any, any>> = {
  defaultProps?: Theme['defaultProps']
  mapProps?: Theme['mapProps'][]
  slots: {
    [K in keyof Theme['slots']]?: MaybeArray<Parts<ThemeProps<Theme>, SlotProps<Theme, K>>>
  }
}

type ThemeProps<Theme> = Theme extends ComponentTheme<infer Props, infer _> ? Partial<Props> : never
type SlotProps<Theme, Name> = Theme extends ComponentTheme<infer _, infer Slots>
    ? Name extends keyof Slots
      ? StyleProperties extends Slots[Name] ? StyleProperties : Partial<Slots[Name]>
      : never
    : never

type Parts<ExternalProps, InternalProps, Tokens = any> = StyleProperties extends InternalProps
  ? string | (StyleProperties & StateSelectors) | ((props: ExternalProps, tokens: Tokens, slotStyle: StyleProperties) => (StyleProperties & StateSelectors & ExternalProps) | string | void | boolean)
  : InternalProps | ((props: ExternalProps) => InternalProps & ExternalProps)

class ThemeBuilder<Theme extends ComponentTheme<any, any>, TokensScheme = Tokens> {
  private theme: Theme = {
    slots: {},
  }

  slot<Name extends keyof Theme['slots']>(
    name: Name,
    parts: MaybeArray<Parts<ThemeProps<Theme>, SlotProps<Theme, Name>, TokensScheme>>
  ) {
    this.theme.slots[name] = Array.isArray(parts)
      ? parts
      : [parts]

    return this
  }
  defaultProps(props: ThemeProps<Theme>) {
    this.theme.defaultProps = props

    return this
  }
  mapProps(map: (props: ThemeProps<Theme>) => ThemeProps<Theme> | void) {
    this.theme.mapProps = [map]
    return this
  }
}










interface ButtonProps extends StyleProperties {
  /** Размер кнопки */
  size?: 's' | 'm' | 'l'
  /** Имя кнопки */
  name?: string
  /** Значение кнопки */
  value?: string | number
  /** Внешний вид кнопки */
  kind?: 'fill' | 'outline' | 'flat'
  /** Нажатое состояние кнопки */
  checked?: boolean
  /** Действие которое совершает кнопка */
  type?: 'button' | 'submit' | 'reset'
  /** Кнопка со спиннером */
  loading?: boolean
  /** Квадратная круглая и вытянутая форма с закругленными углами */
  shape?: 'pill' | 'square' | 'circle'
  /** Вторая строка */
  multiline?: boolean
  /** Кнопка занимает всю ширину */
  block?: boolean
  /** Ссылка для перехода */
  href?: string

  pressedOffset?: number
}


interface TextProps extends StyleProperties {
  /** Размер текста фолбек */
  fontSize?: number
  /** Коэффициент для высоты строки */
  lineHeight?: number | 'none' | 'inherit'
  /** Уплотненная высота строки */
  dense?: boolean
  /** Расстояние между буквами */
  letterSpacing?: number
  /** Жирное начертание */
  bold?: boolean
  /** Легкое начертание */
  light?: boolean
  /** Курсивное начертание */
  italic?: boolean
  /** Текст в верхнем регистре */
  uppercase?: boolean
  /** Подчеркнутый текст */
  underline?: 'dashed' | 'dotted' | boolean
  /** Обрезка высоты строки у текста сверху и снизу */
  crop?: boolean
  /** Текст без переносов */
  noWrap?: boolean
  /** Текст с сохранением всех пробелов */
  pre?: boolean
  /** Многоточие в конце строки */
  truncate?: boolean
  /** Инлайновое поведение */
  inline?: boolean
  /** Блочное поведение */
  block?: boolean
  /** Пресет компонента */
  preset?: 'title' | 'title-small' | 'heading-large' | 'heading' | 'heading-small'
}

type ButtonTheme = ComponentTheme<ButtonProps, {
  Button: Slot,
  Text: Slot<TextProps>,
}>




const a = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps(({ shape }) => { if (false) return {} })
  .slot('Button', {
    display: 'block',
    shrink: false,
  })


const aa = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps(({ shape }) => { if (false) return {} })
  .slot('Button', [
    {
      display: 'block',
      shrink: false,
      hover: {

      }
    },
    (props) => ({
      display: 'block',
      shrink: false,
      ...props
    }),
    (props) => undefined,
    (props) => props && {
      display: 'block',
    },
    (props, tokens) => ''
  ])
  .slot('Text', [
    (props) => ({
      shrink: false,
    })
  ])

  type Q = {
    0: boolean
    1: string
  }

  const q: Q = [true, 'ss']

  type AAA = StyleProperties & StateSelectors
  type A<U> = U extends StyleProperties ? boolean : U

  type W = A<AAA>

  type aa3eee = StyleProperties extends TextProps ? 1 : 2
type aaeeefef = TextProps extends StyleProperties ? 1 : 2