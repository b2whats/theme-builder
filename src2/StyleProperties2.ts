import type { Tokens } from './tokens'
import { get } from './utils'


type PathImpl<T, Key extends keyof T> =
  Key extends string
  ? T[Key] extends Record<string, any>
    ? | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
      | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

type ObjectPaths<T> = PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T;

type PathValue<T, P extends ObjectPaths<T>> =
  P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends ObjectPaths<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P] extends object
      ? keyof T[P]
      : T[P]
    : never;

    type Obj = {
      1: string
      a: number
      b: {
        bb: number
        bbb: string
      }
      c: [{ c: number }, number]
    }
    type Obj1 = {
      1: string
      a: number
      b: {
        bb: number
        bbb: string
      }
      c: ({ c: number } | number)[]
    }

    type dd = ObjectPaths<Obj>
    type dd1 = ObjectPaths<Obj1>

type PropertyValue<Properties> = {
  [K in keyof Properties & string]?: Properties[K] extends (val: infer Args, tokens: any, properties: any) => any ? Args : never
}

// Если есть transform подмерживать тип свойств в функцию
type Options<Path, Name, PropertiesValue, Value, Short> = {
  name: Name
  token?: Path
  shortcut?: Short
  transform?: (value: any) => string
} & ([Short] extends [never]
  ? { get: (value: Value) => string }
  : unknown
)

class PropertyBuilder<Tokens extends {}, Properties = {}> {
  public properties: any = {}

  append<Name extends string, Short extends (keyof Properties)[] = never, Value = never, Path extends ObjectPaths<Tokens> = never>(
    options: Options<Path, Name, PropertyValue<Properties>, Value, Short>
  ): PropertyBuilder<Tokens, Properties & { [K in Name]: (value: PathValue<Tokens, Path> | Value, tokens: Tokens) => string }> {
    this.properties[options.name as string] = (value: any, tokens: Tokens) => {
      if (options.token) {
        value = typeof value === 'boolean'
          ? value === true
            ? get(tokens, (options as any).token)
            : undefined
          : get(tokens, (options as any).token) || value
      }

      if (options.transform) {
        value = options.transform(value)
      }

      return (options as any).get(value)
    }

    return this as any
  }

  get<Name extends keyof Properties>(property: Name) {
    return this.properties[property]
  }
}

type Str = (string & {})

function execDimension(value: number | string) {
  if (typeof value === 'number') {
    return Math.abs(value) > 1 ? `${value}px` : `${value * 100}%`
  }

  return value
}

const spaceValue = (value: string | number): string => {
  if (typeof value === 'number') {
    return Math.abs(value) > 0.99 ? `${value}px` : `${value * 100}%`
  }

  return value
}

export const Properties = new PropertyBuilder<Tokens>()
  .append({
    name: 'fontFamily',
    get: (value: string) => `font-family: ${value};`
  })
  .append({
    name: 'fontSize',
    token: 'font.fontSize',
    get: (value: number) => `font-size: ${value}px;`
  })
  .append({
    name: 'lineHeight',
    token: 'font.lineHeight',
    get: (value: number) => `line-height: ${value};`
  })
  .append({
    name: 'letterSpacing',
    get: (value: number) => `letter-spacing: ${value}px;`
  })
  .append({
    name: 'fontWeight',
    get: (value: 'light' | 'normal' | 'bold' | number) => `font-weight: ${value};`
  })
  .append({
    name: 'italic',
    get: (value: boolean) => value ? `font-style: italic;` : ''
  })
  .append({
    name: 'noWrap',
    get: (value: boolean) => value ? `white-space: nowrap;` : ''
  })
  .append({
    name: 'pre',
    get: (value: boolean) => value ? `white-space: pre-wrap;` : ''
  })
  .append({
    name: 'wrap',
    get: (value: boolean) => value ? 'flex-wrap: wrap; word-break: break-all;' : ''
  })
  .append({
    name: 'uppercase',
    get: (value: boolean) => value ? 'text-transform: uppercase;' : ''
  })
  .append({
    name: 'cursor',
    get: (value: 'auto' | 'none' | 'pointer') => `cursor: ${value};`
  })
  .append({
    name: 'truncate',
    get: () => `
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: normal;
      overflow: hidden;
      display: inline-block;
    `
  })
  .append({
    name: 'smoothing',
    get: (() => {
      const webkitSmoothing = { auto: 'auto', antialiased: 'antialiased', subpixel: 'subpixel-antialiased' }
      const mozSmoothing = { auto: 'auto', antialiased: 'grayscale', subpixel: 'grayscale' }

      return (value: 'auto' | 'antialiased' | 'subpixel') => `
        -webkit-font-smoothing: ${webkitSmoothing[value]};
        -moz-osx-font-smoothing: ${mozSmoothing[value]};
      `
    })()
  })
  .append({
    name: 'height',
    token: 'dimension.rowHeight',
    transform: execDimension,
    get: (value: Str | number) => `height: ${value};`
  })
  .append({
    name: 'minHeight',
    token: 'dimension.rowHeight',
    transform: execDimension,
    get: (value: Str | number) => `min-height: ${value};`
  })
  .append({
    name: 'maxHeight',
    token: 'dimension.rowHeight',
    transform: execDimension,
    get: (value: Str | number) => `max-height: ${value};`
  })
  .append({
    name: 'width',
    transform: execDimension,
    get: (value: string | number) => `width: ${value};`,
  })
  .append({
    name: 'minWidth',
    transform: execDimension,
    get: (value: number | string) => `min-width: ${value};`
  })
  .append({
    name: 'maxWidth',
    transform: execDimension,
    get: (value: number | string) => `max-width: ${value};`
  })
  .append({
    name: 'grow',
    get: (value: boolean) => `flex-grow: ${value ? '1' : '0'};`
  })
  .append({
    name: 'shrink',
    get: (value: boolean) => `flex-shrink: ${value ? '1' : '0'};`
  })
  .append({
    name: 'order',
    get: (value: number) => `order: ${value};`
  })
  .append({
    name: 'borderStyle',
    get: (value: string) => `border-style: ${value};`
  })
  .append({
    name: 'borderTopStyle',
    get: (value: string) => `border-top-style: ${value};`
  })
  .append({
    name: 'borderRightStyle',
    get: (value: string) => `border-right-style: ${value};`
  })
  .append({
    name: 'borderBottomStyle',
    get: (value: string) => `border-bottom-style: ${value};`
  })
  .append({
    name: 'borderLeftStyle',
    get: (value: string) => `border-left-style: ${value};`
  })
  .append({
    name: 'borderWidth',
    get: (value: number) => `border-width: ${value}px;`
  })
  .append({
    name: 'borderTopWidth',
    get: (value: number) => `border-top-width: ${value}px;`
  })
  .append({
    name: 'borderRightWidth',
    get: (value: number) => `border-right-width: ${value}px;`
  })
  .append({
    name: 'borderBottomWidth',
    get: (value: number) => `border-bottom-width: ${value}px;`
  })
  .append({
    name: 'borderLeftWidth',
    get: (value: number) => `border-left-width: ${value}px;`
  })
  .append({
    name: 'borderRadius',
    token: 'dimension.borderRadius',
    get: (value: number) => `border-radius: ${value}px;`
  })
  .append({
    name: 'align',
    get: (value) => `XXXX`
  })
  .append({
    name: 'valign',
    get: (value) => `XXXX`
  })
  .append({
    name: 'valignSelf',
    get: (() => {
      const alignFlex = {
        top: 'flex-start',
        middle: 'center',
        bottom: 'flex-end',
        baseline: 'baseline',
        stretch: 'stretch',
      }

      const verticalAlign = {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom',
        baseline: 'baseline',
        stretch: 'baseline',
      }

      return (value: keyof typeof alignFlex) => `
        align-self: ${alignFlex[value]};
        vertical-align: ${verticalAlign[value]};
      `
    })()
  })
  .append({
    name: 'column',
    get: (value: boolean) => value ? 'flex-direction: column;' : ''
  })
  .append({
    name: 'color',
    token: 'palette',
    get: (value: Str) => `color: ${value};`
  })
  .append({
    name: 'bg',
    token: 'palette',
    get: (value: Str) => `background-color: ${value};`
  })
  .append({
    name: 'borderColor',
    token: 'palette',
    get: (value: Str) => `border-color: ${value};`
  })
  .append({
    name: 'placeholderColor',
    token: 'palette',
    get: (value: Str) => `&::placeholder, & *::placeholder {color: ${value};-webkit-text-fill-color: currentcolor;}`
  })
  .append({
    name: 'position',
    get: (value: 'relative' | 'absolute' | 'static' | 'fixed') => `position: ${value};`
  })
  .append({
    name: 'top',
    transform: execDimension,
    get: (value: number | string) => `top: ${value};`
  })
  .append({
    name: 'right',
    transform: execDimension,
    get: (value: number | string) => `right: ${value};`
  })
  .append({
    name: 'bottom',
    transform: execDimension,
    get: (value: number | string) => `bottom: ${value};`
  })
  .append({
    name: 'left',
    transform: execDimension,
    get: (value: number | string) => `left: ${value};`
  })
  .append({
    name: 'overflow',
    transform: execDimension,
    get: (value: 'hidden' | 'visible' | 'scroll' | 'auto') => `overflow: ${value};`
  })
  .append({
    name: 'visible',
    get: (value: boolean) => `visibility: ${value ? 'visible' : 'hidden'};`
  })
  .append({
    name: 'opacity',
    get: (value: number) => `opacity: ${value};`
  })
  // TODO: не очень красиво выглядит. в случае когда у нас есть токен а значение булево,
  // нужно подобрать правильный тип
  .append({
    name: 'focus',
    token: 'focus',
    get: (value: boolean) => `
      outline: none;
      
      ${value ? `
        &&:focus{
          box-shadow: ${value};
          position: relative;
          z-index: 2;
        }
      ` : ''}
    `
  })
  .append({
    name: 'pointerEvents',
    get: (value: boolean) => value ? '' : `pointer-events: none;`
  })
  // TODO: Подумать как передавать цвет
  .append({
    name: 'shadow',
    token: 'shadow',
    get: (value: string) => `box-shadow: ${value};`
  })
  .append({
    name: 'zIndex',
    token: 'zIndex',
    get: (value) => `z-index: ${value};`
  })
  .append({
    name: 'userSelect',
    get: (value) => `user-select: ${value ? 'auto' : 'none'};`
  })
  .append({
    name: 'transition',
    token: 'transition',
    get: (value: false) => value ? `transition: all ${value};` : ''
  })
  .append({
    name: 'display',
    get: (value: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex') => `display: ${value};`
  })
  .append({
    name: 'pt',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `padding-top: ${value};`
  })
  .append({
    name: 'pr',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `padding-right: ${value};`
  })
  .append({
    name: 'pb',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `padding-bottom: ${value};`
  })
  .append({
    name: 'pl',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `padding-left: ${value};`
  })
  .append({
    name: 'p',
    shortcut: ['pt', 'pr', 'pb', 'pl'],
  })
  .append({
    name: 'mt',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `margin-top: ${value};`
  })
  .append({
    name: 'mr',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `margin-right: ${value};`
  })
  .append({
    name: 'mb',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `margin-bottom: ${value};`
  })
  .append({
    name: 'ml',
    token: 'space',
    transform: spaceValue,
    get: (value: number | Str) => `margin-left: ${value};`
  })


// type T<V, VV> = {
//   v: V,
//   vv?: VV,
//   // vvv: VV extends never ? 1 : 2
//   vvv: [VV] extends [never] ? (val: V) => void : null
// }
type T<V, VV> = {
  v: V,
  vv?: VV,
} & ([VV] extends [never] ? {
  vvv: (val: V) => void
} : unknown)

type R = T<number, never>
function a<V, VV extends ('a' | 'b')[] = never>(val: T<V, VV>): [V, VV] {
  return {} as any
}
type rre = 'a' extends never ? 1 : 2
type rre1 = ['a'] extends [never] ? 1 : 2
type rr = string extends never ? 1 : 2
type rrr = never extends never ? 1 : 2
a({ v: 1, vv: ['a'] })
a({ v: 1, vvv: (val) => {}})
//a({ v: 1, vv: ['b'], vvv: () => {}})
type c = unknown & {a: 1}

type Options2<V, VV> = {
  name?: V
  shortcut?: VV
  get: [VV] extends [never] ? (val: V) => void : null
}
class PropertyBuilder2<Properties = {
  a: string,
  b: string
}> {
  public properties!: Properties

  append<Name, Short extends (keyof Properties)[] = never>(
    options: Options2<Name, Short>
  ): [Name, Short] {
    return this as any
  }
}

new PropertyBuilder2().append({
  name: 'qwe',
  shortcut: ['a'],
  get: null
})



type q = 'a' & ('a' | 'b')
type we = string extends never ? 1 : 2
