import { flatObject, isFunction } from './utils'
import { weakMemoize, primitiveMemoize, mergeObject } from './merge'
import type { FlatObjectReturn } from './utils'

type PropertyOptions<Name = string, Tokens = unknown> = {
  name: Name
  token?: Tokens
  get: (value: any) => string
}

type Options<Path, Name, PropertiesValue, Value, Short> = {
  name: Name
  token?: Path
  shortcut?: Short
  transform?: (value: any) => string
} & ([Short] extends [never]
  ? { get: (value: Value) => string }
  : unknown
)

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
type WithStringPrimitive<T> = T extends string ? string extends T ? (string & {}) : T : T
type OnlyLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never

type Identity<T> = T extends unknown ? T : never
type PropertiesMap<Properties extends PropertyOptions, TokensPath extends Record<string, any>> = Identity<{
  [Key in Properties as Key['name']]: (tokens: TokensPath) => (value: WithStringPrimitive<Parameters<Key['get']>[number]> | OnlyLiteral<TokensPath[Key['token'] & string]>) => string
}>

type TokensObject = { [key: string]: string | number | TokensObject }
type BaseTokens = { [key: string]: string | number | TokensObject }


export class DesignSystem<Tokens, Properties> {
  private _baseTokens: BaseTokens = {}
  private tokensLeaves = {} as any
  public cssProperties: Properties = {} as any

  baseTokens<
    T extends BaseTokens,
    T1 extends Tokens
  >(tokens: unknown extends Tokens ? T : DeepPartial<T1>): DesignSystem<unknown extends Tokens ? T : Tokens, Properties> {
    if (this._baseTokens) {
      this._baseTokens = mergeObject(this._baseTokens, tokens)
    } else {
      this.tokens = data
    }

    this.tokensLeaves = flatObject(this.tokens)

    return this as any
  }

  getTokens = () => this.tokens

  brandTokens<O extends object>(data: ((tokens: Tokens) => O) | O): DesignSystem<Tokens & O, Properties> {
    const brand = isFunction(data) ? data(this.tokens) : data

    Object.assign(this.tokens, brand)
    Object.assign(this.tokensLeaves, flatObject(brand))

    return this as any
  }

  getTokenPaths = () => this.tokensLeaves

  properties<
    Property extends PropertyOptions<Name, keyof TokensPath>,
    Name extends string,
    TokensPath = ObjectPaths<Tokens>
  >(data: Property[]): DesignSystem<Tokens, Properties & PropertiesMap<Property, TokensPath>> {
    for (const property of data) {
      if (property.token) {
        this.cssProperties[property.name as string] = weakMemoize((tokensPath) => primitiveMemoize((value) => {
          let resolve
          if (typeof value === 'boolean') {
            resolve = value && tokensPath[`${property.token}`]
          }
          resolve = tokensPath[`${property.token}.${value}`] || tokensPath[`${property.token}`]

          return property.get(resolve || value)
        }))
      } else {
        const getter = primitiveMemoize(property.get as any)

        this.cssProperties[property.name as string] = (_: any) => getter
      }
    }

    return this as any
  }
}








export const tokens = {
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  font: {
    fontSize: {
      s: 13,
      xs: 11,
    },
  },
  palette: {
    red50:  '#FFEDEE',
    red100: '#FFE6E6',
    red200: '#FFC5C6',
 
    white: '#FFFFFF',
  },


  shadow: {
    1: '',
    2: '',
    3: '',
    4: '',
  },

  breakpoint: {
    mobile: '',
    tablet: '',
    web: ''
  }
}







const theme = new DesignSystem()
  .baseTokens(tokens)
  .baseTokens({
    breakpoint: {
      tablet: '',
    }
  })
  .brandTokens((tokens) => ({
    primaryColor: tokens.palette.red50
  }))
  .properties([
    {
      name: 'fff',
      token: 'focus',
      get: (value: boolean) => ''
    }, {
      name: 'qqqq',
      token: 'focus',
      get(value: boolean) { return ''}
    }, {
      name: 'fontWeight',
      get: (value: 'light' | 'normal' | 'bold' | number) => `font-weight: ${value};`
    }
  ])
  .cssProperties



  type StringLiteral<T> = T extends `${string & T}` ? T : never;
  type StringLiteral2<T extends string> = T ;

type CheckLiteral = StringLiteral<'foo'>;  // type is 'foo'
type CheckLiteral2 = StringLiteral2<'foo'>;  // type is 'foo'
type CheckString = StringLiteral<string>;  // type is never
type CheckString2 = StringLiteral2<string>;  // type is never

function makeObject<K extends string>(key: K): { [key in K]: string } {
    return { [key]: 'Hello, World!' } as any
}

const resultWithLiteral = makeObject('hel dd lo');  // type is {hello: string;}
let someString = 'prop';
const resultWithString = makeObject(someString); // compiler error.





type Mapped1<T> = { [k in keyof T]: [T[k], "mapped"] };
type Mapped2<T> = Identity<{ [k in keyof T]: [T[k], "mapped"] }>;

declare function foo1(): Mapped1<{ x: string, y: number }>;
declare function foo2(): Mapped2<{ x: string, y: number }>;

/*
Aliased, bad
const m1: Mapped1<{
    x: string;
    y: number;
}>
*/
const m1 = foo1();
/*
Non-aliased, good
const m2: {
    x: [string, "mapped"];
    y: [number, "mapped"];
}
*/
const m2 = foo2();


type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]


type LeavesEntries<
  O,
  Delimiter extends string = '.',
  Prefix extends string = '',
  Key extends keyof O = keyof O,
  I extends number = 5
> = [I] extends [never] ? never : Key extends string | number
  ? O[Key] extends Record<string, any>
    ? LeavesEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, Exclude<keyof O[Key], keyof any[]>, Prev[I]>
    : [`${Prefix}${Key}`, CastToPrimitive<O[Key]>]
  : never

type CastToPrimitive<T> =
  T extends string ? string :
  T extends number ? number :
  T extends any ? T :
  never

type PathsEntries<
  O,
  Delimiter extends string = '.',
  Prefix extends string = '',
  Key extends keyof O = keyof O,
  I extends number = 5
> = [I] extends [never] ? never : Key extends string | number ?
  O[Key] extends readonly any[] | any[] ?
    | PathsEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, Exclude<keyof O[Key], keyof any[]>, Prev[I]>
    | [`${Prefix}${Key}`, Exclude<keyof O[Key], keyof any[]>] :
  O[Key] extends Record<string, any> ?
    | [`${Prefix}${Key}`, keyof O[Key]]
    | PathsEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, keyof O[Key], Prev[I]> :
  [`${Prefix}${Key}`, CastToPrimitive<O[Key]>] : never

type TupleEntrie<T, I extends number> = T extends [...any[]] ? T[I] : never
type ObjectPaths<O extends {}, Delimiter extends string = '.'> = PathsEntries<O, Delimiter> extends infer Entries
  ? { [K in Entries as TupleEntrie<K, 0>]: TupleEntrie<K, 1> }
  : never

type qq = LeavesEntries<typeof tokens>
type qqqq = PathsEntries<typeof tokens>

type qqq = string extends Record<string, any> ? 1 : 2



