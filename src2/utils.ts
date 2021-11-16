import type { ThemeBuilder } from './ThemeBuilder'

export const isObject = (value: any): value is object => value && value.constructor && value.constructor === Object
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isIterable = (value: any): value is object => Object(value) === value
export const isThemeBuilder = (value: any): value is ThemeBuilder<any> => value && value.constructor && value.constructor.name === 'ThemeBuilder'

export function get(
  obj: object,
  path: string | number,
) {
  const key = typeof path === "string" ? path.split(".") : [path]

  for (let index = 0; index < key.length; index += 1) {
    if (!obj) break
    obj = obj[key[index]]
  }

  return obj
}

export const flatObjectEntries = <
  O extends Record<string, any>
>(object: O, delimiter: string = '.', prefix: string = ''): [string, any][] => Object
  .entries(object)
  .flatMap(
    ([key, value]) => isIterable(value)
      ? flatObjectEntries(value, delimiter, `${prefix}${key}${delimiter}`)
      : [[ `${prefix}${key}`, value ]]
  )

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type FlatObjectEntries<O, Delimiter extends string = '.', Prefix extends string = '', Key extends keyof O = keyof O, I extends number= 5> = [I] extends [never] ? never : Key extends string | number
  ? O[Key] extends Record<string, any>
    ? FlatObjectEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, Exclude<keyof O[Key], keyof any[]>, Prev[I]>
    : [`${Prefix}${Key}`, O[Key]]
  : never

type TupleEntrie<T, I extends number> = T extends [...any[]] ? T[I] : never

export type FlatObjectReturn<O extends {}, Delimiter extends string> = FlatObjectEntries<O, Delimiter> extends infer Entries
  ? { [K in Entries as TupleEntrie<K, 0>]: TupleEntrie<K, 1> }
  : never

export const flatObject = <
  O extends Record<string, any>,
  D extends string = '.'
>(object: O, delimiter?: D): FlatObjectReturn<O, D> => Object.fromEntries(flatObjectEntries(object, delimiter || '.')) as any

type Cast<A, B> = A extends B ? A : B

type Narrowable =
| string
| number
| bigint
| boolean

export type Narrow<A> = Cast<A,
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | ({ [K in keyof A]: A[K] extends Function ? A[K] : Narrow<A[K]> })
>

type FlattenType<T extends Record<string, any>> = T extends unknown ? T : never

type LeavesEntries<
  O,
  Delimiter extends string = '.',
  Prefix extends string = '',
  Key extends keyof O = keyof O,
  I extends number = 5
> = [I] extends [never] ? never : Key extends string | number
  ? O[Key] extends readonly any[] | any[]
    ? LeavesEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, Exclude<keyof O[Key], keyof any[]>, Prev[I]>
  : O[Key] extends Record<string, any>
    ? LeavesEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, Exclude<keyof O[Key], Exclude<keyof any[], number>>, Prev[I]>
    : [`${Prefix}${Key}`, CastToPrimitive<O[Key]>]
  : never


type CastToPrimitive<T> =
  T extends string ? string :
  T extends number ? number :
  T extends any ? T :
  never

export type PathsEntries<
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

export type ObjectPaths<O extends Record<string, any>, Entries extends [string, any] = PathsEntries<O>> = FlattenType<{ [K in Entries as K[0] ]: K[1] }>
export type ObjectLeaves<O extends Record<string, any>, Entries extends [string, any] = LeavesEntries<O>> = { [K in Entries as K[0] ]: K[1] }

type UnionToIntersection<U> =   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type UnionToFunctions<U> = U extends unknown ? (k: U) => void : never

type IntersectionOf<T> =
  T extends { (a: infer A): void; (b: infer B): void; (c: infer C): void; (d: infer D): void; (e: infer E): void; (f: infer F): void; (g: infer G): void; (h: infer H): void; } ? [A, B, C, D, E, F, G, H] :
  T extends { (a: infer A): void; (b: infer B): void; (c: infer C): void; (d: infer D): void; (e: infer E): void; (f: infer F): void; (g: infer G): void; } ? [A, B, C, D, E, F, G] :
  T extends { (a: infer A): void; (b: infer B): void; (c: infer C): void; (d: infer D): void; (e: infer E): void; (f: infer F): void; } ? [A, B, C, D, E, F] :
  T extends { (a: infer A): void; (b: infer B): void; (c: infer C): void; (d: infer D): void; (e: infer E): void; } ? [A, B, C, D, E] :
  T extends { (a: infer A): void; (b: infer B): void; (c: infer C): void; (d: infer D): void; } ? [A, B, C, D] :
  T extends { (a: infer A): void; (b: infer B): void; (c: infer C): void; } ? [A, B, C] :
  T extends { (a: infer A): void; (b: infer B): void; } ? [A, B] :
  T extends { (a: infer A): void } ? [A] :
  never

export type UnionToTuple<T> = IntersectionOf<UnionToIntersection<UnionToFunctions<T>>>