import React from 'react'
import { StyleProperties, StateSelectors } from './StyleProperties'
import { Tokens } from './Tokens'

const Test = () => React.createElement('div')

type MaybeArray<Item> = Item extends Array<infer Element>
  ? Item | Element
  : Item[] | Item

export type Slot<Props = unknown> = unknown extends Props
  ? StyleProperties & StateSelectors & { withProps: boolean }
  : Props & { withProps: boolean, component: any }

export type ComponentTheme<Props, Slots> = {
  defaultProps?: Partial<Props>
  mapProps?: (props: Props) => Partial<Props> | void
  slots: {
    [Name in keyof Slots]?: {
      type: 'tag' | 'component',
      styles: Parts<Props, Slots[Name]>[]
    }
  }
}

type PropertyAsFunction<Map, Args> = { 
  [Key in keyof Map]?: NonNullable<Map[Key]> extends object
    ? PropertyAsFunction<Map[Key], Args>
    : Map[Key] | ((props: Args) => Map[Key])
}

type Parts<ExternalProps, SlotProps> = SlotProps extends StateSelectors
  ? string
    | PropertyAsFunction<SlotProps, ExternalProps>
    | ((props: ExternalProps, tokens: Tokens, slotStyles: SlotProps) => string)
  : PropertyAsFunction<SlotProps, ExternalProps>

type SwitchMap<Values, Result> = {
  [Value in Extract<Values, string>]?: Result
}

interface SlotUtils {
  if<ExternalProps, Props extends MaybeArray<keyof ExternalProps>, Values, PropertyValues extends Values>(
    prop: Props | Props[],
    value: PropertyValues,
    defaultValue?: PropertyValues,
  ): (props: ExternalProps) => Values | undefined
  mapped<ExternalProps, Prop extends keyof ExternalProps, Values, Default extends Values>(
    prop: Prop,
    body: SwitchMap<ExternalProps[Prop], Values>,
    defaultValue?: Default,
  ): (props: ExternalProps) => Values | undefined
  css<ExternalProps, SlotProps>(
    literals: TemplateStringsArray,
    ...placeholders: Array<(props: ExternalProps, tokens: Tokens, slotStyles: SlotProps) => string>
  ): (props: ExternalProps, tokens: Tokens, slotStyles: SlotProps) => string
}

const utils: SlotUtils = {
  if: (keys, value, defaultValue) => {
    return (props: any) => {
      const isValue = Array.isArray(keys)
        ? keys.every(key => Boolean(props[key]))
        : Boolean(props[keys])
      
      return isValue ? value : defaultValue
    }
  },
  mapped: (prop, options, defaultValue) => {
    return (props: any) => {
      const value = props[prop]

      return value in options ? options[value] : defaultValue
    }
  },
  css: (literals, ...placeholders) => {
    return function cssRewrite(props, tokens, slotStyles) {
      let result = ''

      for (let i = 0; i < placeholders.length; i++) {
          result += literals[i];
          result += placeholders[i](props, tokens, slotStyles)
      }
  
      result += literals[literals.length - 1];

      return result
    }
  }
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
  theme: ComponentTheme<any, any> = {
    slots: {}
  }

  slot<Name extends keyof Theme['slots']>(
    name: Name,
    styles: MaybeArray<NonNullable<Theme['slots'][Name]>['styles']>,
    type: 'component' | 'tag' = 'tag'
  ) {
    this.theme.slots[name] = { 
      type,
      styles: Array.isArray(styles) ? styles : [styles]
    }

    return this
  }
  defaultProps(props: Theme['defaultProps']) {
    this.theme.defaultProps = expandShorthands(props)

    return this
  }
  mapProps(map: Theme['mapProps']) {
    this.theme.mapProps = map

    return this
  }
  merge(builder: ThemeBuilder<Theme>) {
    const weight = (val: any): number => {
      if (typeof val === 'string') return 1
      if (typeof val === 'object') return 2
      if (typeof val === 'function') return 3

      return 0
    }
    const merge = (acc: any, cur: any, index: number) => {
      const prev = acc[index - 1]
      if (typeof prev !== typeof cur || typeof cur === 'function') {
        acc.push(cur)

        return acc
      }

      if (typeof cur === 'string') {
        acc[index - 1] = acc[index - 1] + cur

        return acc
      }
      if (typeof cur === 'object') {
        acc[index - 1] = {
          ...acc[index - 1],
          ...cur
        }

        return acc
      }

      return acc
    }
    const instance = new ThemeBuilder<Theme>()

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

    for (let [name, parts] of Object.entries(this.theme.slots)) {
      instance.slot(name, [
        ...parts![name].styles,
        ...builder.theme.slots[name] && (builder.theme.slots[name]!.styles as any),
      ].sort((a, b) => weight(a) - weight(b)).reduce(merge, []), parts!.type)
    }

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


const a = new ThemeBuilder<ButtonTheme>()
  .defaultProps({
    size: 'm',
    type: 'button',
  })
  .mapProps(({ shape }) => { if (false) return {} })
  .slot('Button', {
    shrink: false
  })
  .slot('Button', {
    withProps: true,
    shrink: false,
    grow: (props) => true,
    color: (props) => 'black20',
  })
  .slot('Button', [
    '',
    {
      pl: utils.if('iconAfter', 12),
      pr: utils.if(['iconAfter', 'children'], 12, 16),
      color: utils.mapped('kind', { fill: 'black20', flat: 'black20' }, 'red300')
    },
    utils.css`
      color: ${(props, tokens) => ''};
    `
  ])
  .slot('Text', {
    withProps: true,
    bold: () => true,
    component: Test
  })

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
      borderRadius: 5,
      pl: ({ iconBefore, children }) => iconBefore && children ? 12 : 16,
      pr: ({ iconBefore, children }) => iconBefore && children ? 12 : 16,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'transparent',
      focus: false,
      minHeight: ({ size }) => size,
      py: ({ size }) => ({ s: 4, m: 6, l: 8 }[size!]),
      userSelect: false,
    },
    (props, tokens, slotStyle) => ''
  ])

