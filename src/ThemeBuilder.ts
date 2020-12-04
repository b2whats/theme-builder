import { StyleProperties, StateSelectors } from './StyleProperties'
import { Tokens } from './Tokens'

type MaybeArray<Item> = Item[] | Item
export type Slot<Props = StyleProperties> = Props

export type ComponentTheme<Props, Slots> = {
  defaultProps?: Partial<Props>
  mapProps?: (props: Props) => Partial<Props> | void
  slots: Slots
}

type ThemeProps<Theme> = Theme extends ComponentTheme<infer Props, infer _> ? Partial<Props> : never
type ThemeSlots<Theme> = Theme extends ComponentTheme<infer _, infer Slots> ? Slots : never
type ThemeSlotProps<Theme, Name> = Theme extends ComponentTheme<infer _, infer Slots>
    ? Name extends keyof Slots
      ? Slots[Name]
      : never
    : never

type PropertyAsFunction<Map, Args> = { 
  [Key in keyof Map]?: NonNullable<Map[Key]> extends object
    ? PropertyAsFunction<Map[Key], Args>
    : Map[Key] | ((props: Args) => Map[Key])
}

type Parts<ExternalProps, InternalProps> = StyleProperties extends InternalProps
  ? string |
    PropertyAsFunction<StyleProperties & StateSelectors, ExternalProps> |
    ((props: ExternalProps, tokens: Tokens, slotStyle: StyleProperties) => string)
  : InternalProps |
    PropertyAsFunction<InternalProps, ExternalProps> |
    ((props: ExternalProps) => InternalProps & ExternalProps)

    
const aqw = (a: Parts<ThemeProps<ButtonTheme>, ThemeSlotProps<ButtonTheme, 'Textd'>>) => {
  typeof a === 'function' ? a : a
  if (typeof a === 'function') {
    a
  }
}

type SlotStyles<Theme, Name> = MaybeArray<Parts<ThemeProps<Theme>, ThemeSlotProps<Theme, Name>>>

type SlotBuilder<Theme, Name> = (slot: SlotUtils<ThemeProps<Theme>, ThemeSlotProps<Theme, Name>>) => SlotStyles<Theme, Name>

type SwitchMap<Values, Result> = {
  [Value in Extract<Values, string>]?: Result
}
type SwitchMap1<Values, Result> = Result

interface SlotUtils<ExternalProps, InternalProps> {
  // if(
  //   condition: keyof Props | ((props: Props) => any),
  //   body: MaybeArray<SchemeType<Props, InternalProps>>
  // ): BoundSlot<Props, InternalProps>
  // switch<Prop extends keyof Props>(
  //   condition: Prop,
  //   body: SwitchMap<Props[Prop], MaybeArray<SchemeType<Props, InternalProps>>>
  // ): BoundSlot<Props, InternalProps>
  mapped<Prop extends keyof ExternalProps, Values, Default extends Values>(
    prop: Prop,
    body: SwitchMap<ExternalProps[Prop], Values>,
    defaultValue?: Default,
  ): (props: ExternalProps) => Values | undefined
}

const slotUtils: SlotUtils<any, any> = {
  // if: (condition, body) => ({
  //   $then: Array.isArray(body) ? body : [body],
  //   $if: typeof condition === 'function' ? condition : (props: any) => props[condition],
  // }),
  // switch: (condition, options) => {
  //   const res = { $switch: condition }
  //   Object.entries(options).forEach(([key, body]) => {
  //     res[key] = Array.isArray(options[key]) ? body : [body]
  //   })
  //   return res
  // },
  mapped: (prop, options, defaultValue) => {
    return (props: any) => {
      const value = props[prop]
      return value in options ? options[value] : defaultValue
    }
  },
}

const shortHands = {
  m: (value: any) => ({ mt: value, mr: value, mb: value, ml: value }),
  mx: (value: any) => ({ mr: value, ml: value }),
  my: (value: any) => ({ mt: value, mb: value }),
  p: (value: any) => ({ pt: value, pr: value, pb: value, pl: value }),
  px: (value: any) => ({ pr: value, pl: value }),
  py: (value: any) => ({ pt: value, pb: value }),
  bold: (value: boolean) => value && ({ fontWeight: 600 }),
  light: (value: boolean) => value && ({ fontWeight: 300 }),
}

const isObject = (value: any): value is object => value && value.constructor && value.constructor === Object

function expandShorthands<T>(
  styles: T
): T {
  let results = {} as T

  for (let [key, value] of Object.entries(styles)) {
    if (shortHands[key]) {
      Object.assign(results, shortHands[key](value))

      continue
    }
    if (['disabled', 'hover', 'active', 'visited', 'checked'].includes(key)) {
      results[key] = expandShorthands(value)
    }

    results[key] = value
  }

  return results
}

class ThemeBuilder<Theme extends ComponentTheme<any, any>> {
  private theme = {
    slots: {},
  } as Theme

  slot<Name extends keyof ThemeSlots<Theme>>(
    name: Name,
    styles: SlotStyles<Theme, Name>,
    type?: 'component' | 'tag',
  ) {
    if (typeof styles === 'function') {
      styles
    }

    this.theme.slots[name] = { 
      type,
      styles: Array.isArray(styles) ? styles : [styles]
      // styles: styles.map(part => isObject(part) ? expandShorthands(part) : part ) 
    }

    return this
  }
  defaultProps(props: ThemeProps<Theme>) {
    this.theme.defaultProps = expandShorthands(props)

    return this
  }
  mapProps(map: (props: ThemeProps<Theme>) => ThemeProps<Theme> | void) {
    this.theme.mapProps = map

    return this
  }
  merge(builder: ThemeBuilder<Theme>) {
    const instance = new ThemeBuilder<ComponentTheme<ThemeProps<Theme>, ThemeSlots<Theme>>>()

    if (this.theme.defaultProps || builder.theme.defaultProps) {
      instance.defaultProps(
        Object.assign({}, this.theme.defaultProps, builder.theme.defaultProps)
      )
    }

    if (this.theme.mapProps || builder.theme.mapProps) {
      instance.mapProps((props) => ({
        ...this.theme.mapProps && this.theme.mapProps(props),
        ...builder.theme.mapProps && builder.theme.mapProps(props),
      }))
    }

    for (let [key, value] of Object.entries(styles))
    this.theme.mapProps

    return instance
  }
}










interface ButtonProps extends StyleProperties {
  /** Иконка слева */
  children?: any
  /** Иконка слева */
  iconBefore?: React.ReactNode
  /** Иконка справа */
  iconAfter?: React.ReactNode
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
  preset2?: 'title' | 'title-small' | 'heading-large' | 'heading' | 'heading-small'
}

type ButtonTheme = ComponentTheme<ButtonProps, {
  Button: Slot,
  Text: Slot<TextProps>,
}>

type t3t = ButtonTheme extends infer U ? U : 2
// type tt = SlotProps<ButtonTheme, 'Text'>
type gt = ThemeSlots<ButtonTheme>
type aa = StyleProperties extends ThemeSlots<ButtonTheme>['Text'] ? 1 : 2
// type aaeeeeee = StyleProperties extends SlotProps<ButtonTheme, 'Text'> ? 1 : 2
type aa3eee = StyleProperties extends TextProps ? 1 : 2
type aaeeefef = TextProps extends StyleProperties ? 1 : 2
// type aaeeeee = SlotProps<ButtonTheme, 'Text'> extends TextProps ? 1 : 2
type aa33 = ThemeSlots<ButtonTheme>
type aa3e3 = NonNullable<ThemeSlots<ButtonTheme>['Text']>
type aae = NonNullable<ThemeSlots<ButtonTheme>['Text']> | undefined extends StyleProperties ? 1 : 2
type qweq = TextProps extends never ? 1 : 2
type qweqwq = never extends TextProps ? 1 : 2
type qweqwwq = unknown extends TextProps ? 1 : 2
type qweqwwddq = unknown extends unknown ? 1 : 2
type qweqwwwq = never extends never ? 1 : 2


const a = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps(({ shape }) => { if (false) return {} })
  .slot('Button', [
    'fewf',
    {
      shrink: false,
      grow: (props) => false,
      hover: {
        shrink: false,
        grow: (props) => false,
      }
    },
    (props, tokens, slotStyle) => ''
  ], 'tag')
  .slot('Text', slot => [

    {
      color: slot.mapped('variant', { primary: 'black20'}, 'black20')
    }
  ], 'component')

  const ae = <Values>(props: Values): Values => {
    return props
  }
  const b = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps(({ shape }) => { if (false) return {} })
  .slot('Button', [
    `    
      font-family: inherit;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      margin: 0;
      line-height: 0;
      position: relative;
      white-space: nowrap;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-touch-callout: none;
      &::-moz-focus-inner {
        border: 0;
      }
      a& {
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    `,
    {
      shrink: false,
      borderRadius: 5,
      pl: ({ iconBefore, children }) => iconBefore && children ? 12 : 16,
      pr: ({ iconBefore, children }) => iconBefore && children ? 12 : 16,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'transparent',
      focus: false,
      color: ae('re'),
      minHeight: ({ size }) => size,
      py: ({ size }) => ({ s: 4, m: 6, l: 8 }[size!]),
      userSelect: false,
    },
    (props, tokens, slotStyle) => ''
  ])
  .slot('Text', [
    (props) => ({
      shrink: false,
    }),
    {
      shrink: (props) => true
    }
  ])
  .merge(a)
  .slot('Text', [
    (props) => ({
      shrink: false,
    }),
    {
      shrink: (props) => true
    }
  ])
  
type qq = typeof a 

const aa = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps(({ shape }) => { if (false) return {} })
  .configSlot('Button', 'tag', [
    (props) => ({
      shrink: false,
      ...props
    }),
    (props) => undefined,
    (props) => props && {
    },
    (props, tokens) => ''
  ])
  .configSlot('Button', [
    (props) => ({
      shrink: false,
      ...props
    }),
    (props) => undefined,
    (props) => props && {
    },
    (props, tokens) => ''
  ], [])
  .slot('Text', [
    (props, state) => ({
      shrink: false,
    })
  ], 'component')

  type Q = {
    0: boolean
    1: string
  }

  const q: Q = [true, 'ss']

  type AAA = StyleProperties & StateSelectors
  type A<U> = U extends StyleProperties ? boolean : U

  type W = A<AAA>
