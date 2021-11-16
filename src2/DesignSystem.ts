// import { flatObject, isFunction } from './utils'
// import { weakMemoize, primitiveMemoize, mergeObject } from './merge'
import type { FlatObjectReturn, ObjectPaths, ObjectLeaves, Narrow, PathsEntries, UnionToTuple } from './utils'
import { mergeObject } from './merge'

const originalSymbol = Symbol('original')

type TokensScheme = {
  [key: string]: number | string | TokensScheme | (number | string | TokensScheme)[] | []
}



type PropertyOptions<Token> = {
  name: string
  token?: Token
  toString: (value: any, bool?: boolean) => string
}

const aaa: TokensScheme = {}
const t = {
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  num: {
    1: 1,
    2: 2,
    3: 3,
  },
  font: {
    fontSize: {
      s: 13,
      xs: 11,
    },
  },
  rowHeight: {
    s: 20,
    m: 30,
    l: 40
  },
  palette: {
    red50:  '#FFEDEE',
    red100: '#FFE6E6',
    red200: '#FFC5C6',
    primary: 'blue'
  },
}
type P = ObjectPaths<typeof t>
type FlattenType<T extends Record<string, any>> = T extends unknown ? T : never
type FlattenType2<T> = T extends infer T ? T : never
type FlattenType3<T extends Record<string, any>> = {
  [K in keyof T]: T[K]
}
class Tokens<Scheme extends TokensScheme = {}, Paths = ObjectPaths<Scheme>> {
  constructor(
    public defaultTokens: Scheme
  ) {}
}

const tokens = new Tokens({
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  tt: 'ffef',
  qq: 111,
  breakpoints: [1,2,3],
  num: {
    1: 1,
    2: 2,
  },
  font: {
    fontSize: {
      s: 13,
      xs: 11,
    },
  },
  rowHeight: {
    s: 20,
    m: 30,
    l: 40
  },
  palette: {
    red50:  '#FFEDEE',
    red100: '#FFE6E6',
    red200: '#FFC5C6',
    primary: 'blue'
  },
})

type PropertyConfig<TokensPath, AdditionalTypes = never> = {
  token?: TokensPath
  toString: (value: AdditionalTypes) => string
}

type MaybeArray<T, N extends number> = Partial<TupleOf<T, N>>
type GeTokensPath<T> = T extends Tokens<any, infer Paths> ? Paths : never
type ComputedProperty<Name extends string, AdditionalTypes, Breakpoints> = {
  [key in Name]: AdditionalTypes | (Breakpoints extends any[] ? MaybeArray<AdditionalTypes,Breakpoints['length']> : never)
}
type FlattenObjectType<O extends object> = FlattenType<{
  [K in keyof O]: O[K]
}>
type WithPrimitive<T, P> = T extends string | number ? P extends T ? (P & {}) : T : T
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type IsUnion<T> = boolean extends T ? false :
  [T] extends [UnionToIntersection<T>] ? false : true

type Every<T, P> = T extends P ? true : unknown
type MergePrimitiveTypes<A, B> = IsUnion<A> extends true
  ? Every<A, string> extends true
    ? WithPrimitive<B, string> | A
    : WithPrimitive<B, number> | A
  : A | B
type TokensValueType<T> = IsUnion<T> extends true ? T : T extends never ? never : boolean
type rrr = [boolean] extends [never] ? 1 : 2
type T1 = TokensValueType<never>
type T2 = MergePrimitiveTypes<T1, number>
type T3 = IsUnion<T1> extends true ? 1 : 2
type T4 = UnionToIntersection<boolean>
type T5 = boolean extends never ? 1 : 2
type T6<U> = (U extends any ? (k: U) => void : never)
type T7 = T6<boolean>
type T8 = ((k: false) => void) | ((k: true) => void) extends ((k: infer I) => void) ? 1 : 2
type T9<T> = T extends unknown ? [T] : never;
type T10 = T9<boolean>

type TupleOf<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

type UnionToFunctions<U> =
    U extends unknown ? (k: U) => void : never;

type LastOf<U> = UnionToIntersection<UnionToFunctions<U>> extends (arg: infer R) => void ? R : never;
type ArrayLength<T extends number> = [1,2,3,4,5,6,7,8,9,10][T]
type qqe = ArrayLength<LastOf<1 |2 |3>>

const qw: Partial<TupleOf<number, 4>> = [1,2,3]
// type Narrow1<A> = Cast<A,
//   | ({ [K in keyof A]: Narrow<A[K]> })
// >
class Properties<DefaultTokens extends Tokens, List extends object = {}, Breakpoints = never> {
  rules!: { [key: string]: (tokens: DefaultTokens, value: any) => string }

  constructor(private tokens: DefaultTokens) {}

  add<
    Name extends string,
    Token extends keyof TokensPathObject = never,
    AdditionalTypes = never,
    TokensPathObject = GeTokensPath<DefaultTokens>
  >(name: Name, config: PropertyConfig<Token, AdditionalTypes>)
  : Properties<
      DefaultTokens, 
      FlattenObjectType<
        List &
        ComputedProperty<
          Name, 
          MergePrimitiveTypes<
            TokensValueType<TokensPathObject[Token]>,
            AdditionalTypes
          >,
          Breakpoints
        >
      >,
      Breakpoints
  > {
    this.rules[name] = (tokens, value) => {
      if (config.token) {
        value = (typeof value === 'boolean' ? tokens[config.token as string] : tokens[`${config.token}.${value}`]) || value
      }

      return config.toString(value)
    }

    return this as any
  }
  breakpoints<
    Token extends keyof TokensPathObject = never,
    TokensPathObject = GeTokensPath<DefaultTokens>
  >(config: PropertyConfig<Token>)
  : Properties<
      DefaultTokens, 
      List,
      UnionToTuple<TokensPathObject[Token]>
  > {

  return this as any
}
  compute<
    Name extends keyof List
  >(name: Name, value: List[Name]): string {
    return ''
  }

  list(): List { return '' as any }
}

type TT = never | string



const properties = new Properties(tokens)
  .add('position', {})
  .breakpoints({
    token: 'breakpoints'
  })
  .add('height', {
    token: 'rowHeight',
    toString: (value: string | boolean) => `height: ${value}px;`,
  })

  .add('color', {
    token: 'palette', 
    toString: (value) => `color: ${value};`
  })
  .add('fontSize', {
    token: 'font.fontSize',
    toString: (value) => `font-size: ${value}px;`
  })
  .add('focus', {
    token: 'focus',
    toString: (value) =>  value ? `
      &&:focus{
        box-shadow: ${value};
        position: relative;
        z-index: 2;
      }
    ` : ''
  })
  //.list()


  type Props = {
    /** Размер кнопки */
    size: 's' | 'm' | 'l'
    variant?: 'promary' | 'secondary'
  }
  
  type StringLiteral<T> = T extends string ? string extends T ? never : T : never;
  type AddPropertyFunction<L extends {}, Props> = {
    [K in keyof L]?: L[K] | ((props: Props) => L[K])
  }
  type GetPropertyTypes<P, Props> = P extends Properties<any, infer L> ? AddPropertyFunction<L, Props> : never
  class Component<Name, Props, PropertiesList extends Properties<any, any>> {
    theme: {
      name: string
      defaultProps: Partial<Props>
      mapProps: (props: Props) => Partial<Props>
      slots: Record<string, object>
    }
  
    constructor(
      protected properties: PropertiesList
    ) {
      this.theme = {
        name: '',
        defaultProps: {},
        mapProps: () => ({}),
        slots: {},

      }
    }
  
    types<P extends object>(): Component<Name, P, PropertiesList> {
      return this as any
    }
  
    name<N extends string>(name: N): Component<N, Props, PropertiesList> {
      this.theme.name = name
  
      return this
    }
    defaultProps(props: Partial<Props>) {
      this.theme.defaultProps = props
  
      return this
    }
    mapProps(map: (props: Props) => Partial<Props>) {
      this.theme.mapProps = map
  
      return this
    }
    slot<Name>(name: Name, config: GetPropertyTypes<PropertiesList, Props> ) {
      this.properties.compute('ddd', 'ddd')
      return this
    }
  }
  
  
  const component = new Component(properties)
    .name('Button')
    .types<Props>()
    .defaultProps({
      size: 's'
    })
    .mapProps((props) => ({
      size: props.size
    }))
    .slot('base', {
      color: ['primary','primary','red100'],
    })
    .slot('text', {
      color: 'red100',
    })
export class DesignSystem<Tokens, Properties, Components = unknown> {
  protected tokensMap: TokensScheme = {}
  public cssProperties: Properties = {}


  tokens<T extends TokensScheme>(tokens: T): DesignSystem<Tokens & T, Properties> {


    return this
  }


  // getTokens = () => this.tokens

  properties<
    Property extends PropertyOptions<keyof TokenPaths>[],
    TokenPaths extends ObjectPaths<Tokens>
  >(properties: Narrow<Property>): DesignSystem<Tokens, Properties & Property> {
    // for (const property of properties) {
    //   if (property.token) {
    //     this.cssProperties[property.name] = weakMemoize((tokensPath) => primitiveMemoize((value) => {
    //       let resolve
    //       if (typeof value === 'boolean') {
    //         resolve = value && tokensPath[`${property.token}`]
    //       }
    //       resolve = tokensPath[`${property.token}.${value}`] || tokensPath[`${property.token}`]

    //       return property.get(resolve || value)
    //     }))
    //   } else {
    //     const getter = primitiveMemoize(property.get as any)

    //     this.cssProperties[property.name] = (_: any) => getter
    //   }
    // }

    return this as any
  }

  component<Return>(ctor: (theme: Component<any, any, Properties>) => Return): DesignSystem<Tokens, Properties, Return extends Component<any, infer X, any> ? X : never> {
    return this
  }
}


type test = ThisParameterType<typeof component>

const BaseButton = {
  minHeight: 's',
  color: 'primary',
  height: 'm',
  fontSize: (props) => props.kind === 'outline' ? 'l' : 'm',
  position: 'relative',
  focus: true,
}


const theme1 = new DesignSystem()
  .tokens({
    focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
    fontSize: {
      s: 13,
      xs: 11,
    },
    rowHeight: {
      s: 20,
      m: 30,
      l: 40
    },
    palette: {
      red50:  '#FFEDEE',
      red100: '#FFE6E6',
      red200: '#FFC5C6',
      primary: 'blue'
    },
  })
  .properties([
    {
      name: 'position',
    },
    {
      name: 'height',
      token: 'rowHeight',
      toString: (value) => `height: ${value}px;`,
    },
    {
      name: 'color',
      token: 'palette',
      toString: (value) => `color: ${value};`
    },
    {
      name: 'fontSize',
      token: 'font.fontSize',
      toString: (value) => `font-size: ${value}px;`
    },
    {
      name: 'focus',
      token: 'focus',
      toString: (value) =>  value ? `
        &&:focus{
          box-shadow: ${value};
          position: relative;
          z-index: 2;
        }
      ` : ''
    }, 
  ])

theme1
  .component((_) => _
    .name('Button')
    .slot('a', 'fontSize')
  )
  .component((_) => _
    .name('Button2')
    .slot('a', 'fontSize')
  )

theme1


export const theme = new DesignSystem()
  .tokens({
    focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
    font: {
      fontSize: {
        s: 13,
        xs: 11,
      },
    },
    rowHeight: {
      s: 20,
      m: 30,
      l: 40
    },
    palette: {
      red50:  '#FFEDEE',
      red100: '#FFE6E6',
      red200: '#FFC5C6',
      primary: 'blue'
    },
  })
  .properties([
    {
      name: 'fontFamily',
      toString: (value) => `font-family: ${value};`
    },
    {
      name: 'fontSize',
      token: 'font.fontSize',
      toString: (value: string) => `font-size: ${value}px;`
    },
    {
      name: 'italic',
      toString: (value: boolean) => `font-style: ${value ? 'italic' : 'normal'};`
    },
    {
      name: 'focus',
      token: 'focus',
      toString: (value: boolean) =>  value ? `
        &&:focus{
          box-shadow: ${value};
          position: relative;
          z-index: 2;
        }
      ` : ''
    }, 
    {
      name: 'fontWeight',
      toString: (value: 'light' | 'normal' | 'bold' | number) => `font-weight: ${value};`
    }
  ])
  //.component('Button')






const BaseButton = styled.button`
  min-height: ${(props) => 
    isMedium(props.size) ? props.theme.rowHeight.m : props.theme.rowHeight.l
  }
  color: ${props => props.theme.primary}
  height: ${props => props.theme.rowHeight[props.size] || props.size + 'px'}
  font-size: ${(props) => `${props.theme.fontSize[props.size]}px;`}
  position: relative;
  ${(props) =>  props.focus ? `
    &&:focus{
      box-shadow: ${props.theme.focus};
      position: relative;
      z-index: 2;
    }
  ` : ''}
`

const BaseButton = {
  minHeight: (props) => isMedium(props.size) ? 'm' : 'l',
  color: 'primary',
  height: 'm',
  fontSize: 'm',
  position: 'relative',
  focus: true,
}


type C1 = ((arg: true) => true) & ((arg: false) => false);
type D1 = C1 extends (arg: infer RR) => infer R ? RR : never;

type UnionToIntersection1<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => infer II
  ? I
  : never;


  // function tuple<T extends any[] & {"0": any}>(array: T): T { return array }
  // declare function needsTuple(arg: [string, number]): void
  
  // const myTuple = tuple(["str", 10])

  // function styledBaseSlot(props) {
  //   return `
  //     background-color: ${({ kind, theme}) => (
  //       kind === 'fill' ? theme.primaryColor :
  //       kind === 'outline' 'white' :
  //       'transparent'
  //     )};
  //     border: ${({ kind, theme}) => (
  //       kind === 'outline' ? `1px solid ${theme.borderColor}` :
  //       'none'
  //     )};
  //     font-size: ${({ theme }) => theme.fontSize};
  // }


  // const tokens = {
  //   ...
  //   Button: {
  //     base: {
  //       backgroundColor: ({ kind }) => ({
  //         fill: 'primaryColor',
  //         outline: 'white'
  //       }[kind]),
  //       borderWidth: ({ kind }) => kind === 'outline'
  //         ? '1px'
  //         : '0px',
  //       borderColor: ({ kind }) => ({
  //         outline: 'borderColor'
  //       }[kind]),
  //       fontSize: 'm'
  //     },
  //     text: {},
  //     before: {},
  //     loader: {},
  //   }
  // }


function tuple<T extends any[] & {"0": any}>(array: T): T { return array }
const myTuple = tuple(["str", 10]) // myTuple would have type [string, number]


type Narrowable11 =
  any[] & { '0': any };

function literalValues1<T  extends TokensScheme>(
  obj: Narrow1<T>
) {
  return obj;
};

type Na<T extends { [K in keyof T]: T[K] }> = {
  [K in keyof T]: T[K] extends [...any[]]  ? T[K]  : T[K]
}
const q = literalValues1({
  s: '32',
  a: []
})

type Cast1<A, B> = A extends B ? B : B 
type Narr<T> = Cast1<T, any[] & { '0': any }>
type O<T> = T extends { [K in keyof T]: T[K] } ? 1 : 2 
type O111 = (1| 2)[] extends [] ? 1 : 2 
type qqq = O<string>


type Cast<A, B> = A extends B ? A : B

type Narrowable1 =
| string
| number
| bigint
| boolean

type CastToPrimitive<T> =
  T extends string ? string :
  T extends number ? number :
  T extends any ? T :
  never
export type Narrow1<A> = Cast<A,
  | (A extends []  ? [] : never)
  | (A extends Narrowable1 ? A : never)
  | ({ [K in keyof A]: A[K] extends Function ? A[K] : Narrow1<A[K]> })
>
const qqqq = {
  s: '3',
  a: [{a: 1},2,3]
}
type OO = Narrow1<typeof qqqq>

const x = {
  y: 12
};

type ttt = keyof typeof x

type BoxElements<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? 1 : 2
};


type QQQ = number[] extends  [...any[]] ? 1 : 2
type qwe = BoxElements<[1,2,3]>

type tu = ['a', 'g']
type qqqw = keyof tu & number



type A = {
  [K in (keyof tu)  ]: tu[K]
}

type TokensScheme1 = {
  [key: string]: number  | TokensScheme1 | [...(number | TokensScheme1)[]] |  []
}

type Narrowable =   string | number | boolean | symbol | object | undefined | void | null | {} | [];
type Narrowable2 =   number   | [] | {}
type PP<A> = A extends { [K in keyof A]: A[K]  extends { [key: string]: any} ? A[K] : Narrowable } ? A : never

function literalValues11<T>(
  obj: PP<T> 
) {
  return obj;
};

const qq = literalValues11({
  s: 4,
  o: {a: 1},
  a: [1]
})

type Index<T extends number> = [never, 0,1,2,3,4,5,6,7,8,9,10][T]
type  Last< T  extends  any [ ] >  =  T[Index<T['length']>];
type roro = Last<[1,2,3,4,45]>
type QWE = Index<5>

type rtrt<T> = T extends never ? 1 : 2 
type qwqw = rtrt<never>
type IsAny<T> = 1 extends never ? 1 : 0;
type rere<T> = (T extends never ? 1 : 0) extends infer S ? S : 2
type ototr = rere<never>
type otot = IsAny<never>


declare function zipLongest<Ts extends Iterable<any>[] | [Iterable<any>]>(iterables: Ts): Iterable<Ts>;
const qqq = zipLongest([[1],[2]])


/**
 * @template T - ggggg
 * @param {T} x - A generic parameter that flows through to the return type
 * @return {T} x - ffff
 */
 function id<T>(x: T): T {
  return x;
}
 
const a = id("string");
const b = id(123);
const c = id({});