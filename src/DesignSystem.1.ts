import { flatObject, isFunction } from './utils'
import type { FlatObjectReturn } from './utils'

type PropertyOptions<T = string> = {
  name: T
  t: number
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

type Narrowable = string | number | boolean | symbol | object |
  null | undefined | void | ((...args: any[]) => any) | {};

const literally = <
  T extends { [k: string]: Narrowable | T | Array<Narrowable |  { [k: string]: Narrowable | T } | T> }[]
>(t: T): T => t;


const test1 = <T extends PropertyOptions<N>, N extends string | number>(arr: T[]): PropertiesMap<T>=> {
  return 'test' as any
}

type Literally<T> = T extends Narrowable | Array<Narrowable | T> | { [k: string]: Narrowable | T } ? T : never 

const b = test1([{ name: 'test', t: 1 }, { name: 'test1', t: 2 }])
const bb = literally([{ name: 'test' , t: 1 }])

type PropertiesMap<Properties> = Identity<{
    [Key in Properties as Key extends PropertyOptions ? Key['name'] : never]: any
  }>

type aa = {
  0: string,
  1: number
}

export class DesignSystem<Tokens extends object, Properties extends object> {
  private tokens = {} as any
  private tokensPath= {} as any
  public cssProperties= {} as Properties

  token<O extends object>(data: O): DesignSystem<Tokens & O, Properties> {
    this.tokens = data
    this.tokensPath = flatObject(data)

    return this as any
  }

  getTokens = () => this.tokens

  brandToken<O extends object>(data: ((tokens: Tokens) => O) | O): DesignSystem<Tokens & O, Properties> {
    const brand = isFunction(data) ? data(this.tokens) : data

    Object.assign(this.tokens, brand)
    Object.assign(this.tokensPath, flatObject(brand))

    return this as any
  }

  getTokenPaths = () => this.tokensPath

  properties<A extends PropertyOptions[]>(data: A): DesignSystem<Tokens, Properties & PropertiesMap<A>> {


    return this as any
  }
}








export const tokens = {
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

  breakpoint: ['40em', '52em', '64em', '80em']
} as const







const theme = new DesignSystem()
  .token(tokens)
  .brandToken((tokens) => ({
    primaryColor: tokens.palette.red50
  }))
  .properties([{
    name: 'ffdddf'
  }])
  .cssProperties



  type StringLiteral<T> = T extends `${string & T}` ? T : never;

type CheckLiteral = StringLiteral<'foo'>;  // type is 'foo'
type CheckString = StringLiteral<string>;  // type is never

function makeObject<K extends string>(key: K): { [key in K]: string } {
    return { [key]: 'Hello, World!' } as any
}

const resultWithLiteral = makeObject('hel dd lo');  // type is {hello: string;}
let someString = 'prop';
const resultWithString = makeObject(someString); // compiler error.



type Identity<T> = T extends unknown ? T : never;

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


type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "/" : "."}${P}`
    : never : never;


type Cons<H, T> = T extends readonly any[] ?
    ((h: H, ...t: T) => void) extends ((...r: infer R) => void) ? R : never
    : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]


type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        [`${K}` | Join<K, Paths<T[K], Prev[D]>>, any]
        : never
    }[keyof T] : ""

type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends Record<string, any> ?
    { [K in keyof T]: [Join<K, Leaves<T[K], Prev[D]>>] }[keyof T] : "";

type qq = Leaves<typeof tokens>