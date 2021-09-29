// import { flatObject, isFunction } from './utils'
// import { weakMemoize, primitiveMemoize, mergeObject } from './merge'
// import type { FlatObjectReturn } from './utils'

// const originalSymbol = Symbol('original')

// type PropertyOptions<Token> = {
//   name: string
//   token?: Token
//   toString: (a: any, b: Token) => string
// }


// type TT<T> = {
//   p: T,
//   to(a: T): void
// }
// function qqq<T extends string>(O: TT<T>) {

// }

// const aqa = qqq({p: 'dd', to: (d) => {}})

// function aa<P, N extends string, T extends 'b' | 'bb' | 'bbb' >(d: (P & PropertyOptions<N, T>)[]): P {
// return '' as any
// }

// const qew = aa([{ name: 'a', token: 'b', toString: (a, v) => '' }, { name: 'aa', token: 'bb', toString: (a, v) => '' }])
// const qew1 = aa([''])


// type Cast<A, B> = A extends B ? A : B;

// type Narrowable =
// | string
// | number
// | bigint
// | boolean;

// type Narrow<A> = Cast<A,
// | []
// | (A extends Narrowable ? A : never)
// | ({ [K in keyof A]: Narrow<A[K]> })
// >;

// type Options<Path, Name, PropertiesValue, Value, Short> = {
//   name: Name
//   token?: Path
//   shortcut?: Short
//   transform?: (value: any) => string
// } & ([Short] extends [never]
//   ? { get: (value: Value) => string }
//   : unknown
// )

// export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
// type WithStringPrimitive<T> = T extends string ? string extends T ? (string & {}) : T : T

// type FlattenType<T extends Record<string, any>> = T extends unknown ? T : never
// type FlattenType2<T> = T extends unknown ? T : never
// type PropertiesMap<Properties extends PropertyOptions<string, any>, TokensPath extends Record<string, any>> = FlattenType<{
//   [Key in Properties as Key['name']]: (tokens: TokensPath) => (value: WithStringPrimitive<Parameters<Key['toString']>[number]> | ReturnIfUnion<TokensPath[Key['token']]>) => string
// }>

// type TokensObject<P = unknown> = { 
//     [key: string]: number | TokensObject<P> | ([unknown] extends [P] ? string : P | (string & {}))
//     [originalSymbol]?: Record<string, any>
//   }

// // Неправильный вывод при передаче {}
// type IsUnion<T, U extends T = T> = T extends any ? [U] extends [T] ? false : true : false
// type ReturnIfUnion<T> = true extends IsUnion<T> ? T : never

// type TokensShape<TokensList = unknown> = {
//   [key: string]: number | ([TokensList] extends [never] ? string : TokensList | (string & {}))
// }

// type TokensShape1<TokensList extends string = never> = {
//   [key: string]: TokensList
// }

// type BrandToken<P> = {
//   [key: string]: P | BrandToken<P>
// }
// type tyy = BrandToken<'a' | 'v'>
// type OfUnion<T extends {name: string}> = {
//   [P in T['name']]: 1
// }


// export class DesignSystem<Tokens, Properties> {
//   protected tokens: TokensShape = {}
//   public cssProperties: Properties = {}

//   static mergeTokens = (source: TokensObject, target: TokensObject) => {
//     const tokens: TokensObject = {}

//     const original = tokens[originalSymbol] = {
//       ...source[originalSymbol] && source[originalSymbol],
//       ...flatObject(target)
//     }

//     for (const [path, value] of Object.entries(original)) {
//       tokens[path] = original[value] || value
//     }

//     return tokens
//   }

//   baseTokens<T extends TokensShape>(tokens: T): DesignSystem<Tokens & T, Properties> {
//     this.tokens = DesignSystem.mergeTokens({}, tokens)

//     return this
//   }

//   brandTokens<T>(tokens: TokensShape<LeavesEntries<Tokens>[0]> ): DesignSystem<Tokens, Properties> {
//     this.tokens = DesignSystem.mergeTokens(this.tokens, tokens as {})

//     return this
//   }

//   getTokens = () => this.tokens

//   properties<
//     Property extends PropertyOptions<keyof Tokens>[],
//     Tokens extends ObjectPaths<Tokens>,
//     F extends any
//   >(properties: Narrow<Property>): DesignSystem<Tokens, Properties & Property> {
//     for (const property of properties) {
//       if (property.token) {
//         this.cssProperties[property.name] = weakMemoize((tokensPath) => primitiveMemoize((value) => {
//           let resolve
//           if (typeof value === 'boolean') {
//             resolve = value && tokensPath[`${property.token}`]
//           }
//           resolve = tokensPath[`${property.token}.${value}`] || tokensPath[`${property.token}`]

//           return property.get(resolve || value)
//         }))
//       } else {
//         const getter = primitiveMemoize(property.get as any)

//         this.cssProperties[property.name] = (_: any) => getter
//       }
//     }

//     return this as any
//   }
// }





// export const tokens = {
//   focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
//   font: {
//     fontSize: {
//       s: 13,
//       xs: 11,
//     },
//   },
//   palette: {
//     red50:  '#FFEDEE',
//     red100: '#FFE6E6',
//     red200: '#FFC5C6',
//   },
// }

// type trtr = LeavesEntries<{a: [1,2,3]}>


// const theme = new DesignSystem()
//   .baseTokens(tokens)
//   .brandTokens({
//     primary: 44
//   })
//   // .properties([
//   //   {
//   //     name: 'fff',
//   //     token: 'focus',
//   //     toString: (value: boolean, t) => ''
//   //   }, {
//   //     name: 'qqqq',
//   //     token: 'focus',
//   //     toString(value: boolean) { return ''}
//   //   }, {
//   //     name: 'fontWeight',
//   //     toString: (value: 'light' | 'normal' | 'bold' | number) => `font-weight: ${value};`
//   //   }
//   // ])
//   // .cssProperties




//   type StringLiteral<T> = T extends `${string & T}` ? T : never;
//   type StringLiteral2<T extends string> = T ;

// type CheckLiteral = StringLiteral<'foo'>;  // type is 'foo'
// type CheckLiteral2 = StringLiteral2<'foo'>;  // type is 'foo'
// type CheckString = StringLiteral<string>;  // type is never
// type CheckString2 = StringLiteral2<string>;  // type is never

// function makeObject<K extends string>(key: K): { [key in K]: string } {
//     return { [key]: 'Hello, World!' } as any
// }

// const resultWithLiteral = makeObject('hel dd lo');  // type is {hello: string;}
// const someString = 'prop jjj';
// const resultWithString = makeObject(someString); // compiler error.





// // type Mapped1<T> = { [k in keyof T]: [T[k], "mapped"] };
// // type Mapped2<T> = FlattenType<{ [k in keyof T]: [T[k], "mapped"] }>;

// // declare function foo1(): Mapped1<{ x: string, y: number }>;
// // declare function foo2(): Mapped2<{ x: string, y: number }>;

// /*
// Aliased, bad
// const m1: Mapped1<{
//     x: string;
//     y: number;
// }>
// */
// // const m1 = foo1();
// /*
// Non-aliased, good
// const m2: {
//     x: [string, "mapped"];
//     y: [number, "mapped"];
// }
// */
// // const m2 = foo2();


// type qq = LeavesEntries<typeof tokens>
// type qqqq = PathsEntries<typeof tokens>

// type qqq = string extends Record<string, any> ? 1 : 2


// export const tokens1 = {
//   br: ['11', '2', '3'],

//   breakpoint: {
//     mobile: '',
//   }
// } as const

// type qwe = ObjectPaths<typeof tokens1>

// type ew = [1,2,3]
// type ttt = Exclude<keyof ew, keyof any[]>
// const qq: ttt = '3' 

// type tttt =Exclude<keyof ew, keyof []>



// export interface XFrameOptionsOptions {
//   action?: "DENY" | "SAMEORIGIN" | (string & {});
// }

// const a: XFrameOptionsOptions = {
//   action: ''
// }

// type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;

// function f<T>(x: T, y: T): T { }
// f(1, null); // returns number
// f(() => 1, () => null);

// type A = 'a' | 1 | null
// type A1 = 'a' | 'b'
// type CustomExtract = A1 extends 'a' | 'b' ? A1 : never;

// const arr = [85, 65, 4, 9] as const;
// type Arr = typeof arr;

// type Values<T> = T[keyof T];

// type ArrayKeys = keyof [];

// type FindIndex<
//   T ,
//   Value extends number = 0,
//   Keys extends keyof T = keyof T
// > = {
//   [P in Keys]: Value extends T[P] ? P : never;
// };

// type q = FindIndex<Arr, 65>





// type WirePlanEntry<T> = [string, (msg: any) => T, (t: T) => Promise<any>]
// // A WirePlanEntryConsumer<R> takes WirePlanEntry<T> for any T, and outputs R
// type WirePlanEntryConsumer<R> = <T>(plan: WirePlanEntry<T>) => R

// const obj = {
//   a: 4,
//   n: [2],
//   s: ["plonk"]
// };

// type ArrayProperties<T> = Pick<T, {
//   [K in keyof T]: T[K] extends Array<any>? K : never
// }[keyof T]>;

// type ForceLookup<T, K> = T[K & keyof T]; 

// declare function single<T, K extends keyof ArrayProperties<T>>(
//   t: T, k: K): ArrayProperties<T>[K][number];
// const n = single(obj, "n"); // number ✔️
// const s = single(obj, "s"); // string ✔️
// const aaaa = single(obj, "a"); // still error ✔️


// type SvgKey = 'path' | 'circle'

// export type SvgCustomTypeOneLiner =
//   SvgKey extends infer T ? T extends SvgKey ? {
//     svgElem: T;
//     svgProps?: JSX.IntrinsicElements[T]
//   } : never : never

//   export type SvgCustomTypeOneLiner1 = {
//     [K in SvgKey]: {
//       svgElem: K;
//       svgProps?: JSX.IntrinsicElements[K]
//     }
//   }[SvgKey]