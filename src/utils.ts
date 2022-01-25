export const isObject = (value: any): value is object => value && value.constructor && value.constructor === Object
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isString = (value: any): value is string => typeof value === 'string'
export const isIterable = (value: any): value is object => Object(value) === value

export function get(
  obj: object,
  path: string | number,
): any {
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
  | (A extends (...args: any[]) => void ? A : never)
  | (A extends Narrowable ? A : never)
  | ({ [K in keyof A]: A[K] extends (...args: any[]) => void ? A[K] : Narrow<A[K]> })
>

type A = {a: number} & { b: string}
type R = FlattenObjectType<A>
export type FlattenType<T> = T extends unknown ? T : never

export type FlattenObjectType<T> = {
  [P in keyof T]: T[P]
} & unknown

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
    ? LeavesEntries<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, keyof O[Key], Prev[I]>
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


type PathsEntries1<
  O,
  Delimiter extends string = '.',
  Prefix extends string = '',
  Key extends keyof O = keyof O,
  I extends number = 7
> = [I] extends [never] ? never : Key extends string | number ?
  O[Key] extends readonly any[] | any[] ?
    | PathsEntries1<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, Exclude<keyof O[Key], keyof any[]>, Prev[I]>
    | [`${Prefix}${Key}`, Exclude<keyof O[Key], keyof any[]>] :
  O[Key] extends Record<string, any> ?
    | [`${Prefix}${Key}`, ...PathsEntries1<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, keyof O[Key], Prev[I]>]
    | PathsEntries1<O[Key], Delimiter, `${Prefix}${Key}${Delimiter}`, keyof O[Key], Prev[I]> :
  [`${Prefix}${Key}`, CastToPrimitive<O[Key]>] : never

export type ObjectPaths<O extends Record<string, any>, Entries extends [string, any] = PathsEntries<O>> = FlattenType<{ [K in Entries as K[0] ]: K[1] }>
export type ObjectLeaves<O extends Record<string, any>, Entries extends [string, any] = LeavesEntries<O>> = { [K in Entries as K[0] ]: K[1] }

type UnionToIntersection<U> =   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type UnionToFunctions<U> = U extends unknown ? (k: U) => void : never
export type IsUnion<T> = boolean extends T ? false :
  [T] extends [UnionToIntersection<T>] ? false : true

export type UnionLast<U> = UnionToIntersection<UnionToFunctions<U>>

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

export type TupleOf<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>
export type DeepPartial<T> = T extends any ? {
  [P in keyof T]?: 
    T[P] extends any[] | [] ? T[P] :
    T[P] extends Record<string, any> ? DeepPartial<T[P]> :
    T[P]
} : never

export function literalValues<T>(obj: Narrow<T>) { return obj }


type UnaryFn<Arg, Return> = (arg: Arg) => Return
export const memoize = <Arg extends any, Return>(func: UnaryFn<Arg, Return>): UnaryFn<Arg, Return> => {
  const cache = new Map()
  
  return arg => {
    let result = cache.get(arg)

    if (result === undefined) {
      result = func(arg)

      cache.set(arg, result)
    }

    return result
  }
}

export const objectHash = (obj: Record<string, any>): string => {
  let str = ''
  
  for (const key in obj) {
    const value = obj[key]
    const type = typeof value

    if (type === 'string' || type === 'number') {
      str += key + value
    } else if (Array.isArray(value)){
      str += key + value.join('|')
    } else if (value === true) {
      str += key + 'T;'
    } else if (value === false) {
      str += key + 'F;'
    } else if(value === null || value === undefined) {
      str += key + 'void;'
    } else if (type === 'function') {
      str += key + 'fn;'
    }
  }

  return str
}

export type MaybeArray<Item> = Item[] | Item

export type NoInfer<T> = T extends infer S ? S : never;



type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`

export type Paths<T> = (T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<Paths<T[K]>>}` | K }[Exclude<keyof T, symbol>]
    : '') extends infer D ? Extract<D, string> : never;


export type ComponentType<T = any, R = null | undefined> = (props: T) => R
export type FunctionPartialAttr<T> = T extends ComponentType<infer P, infer R> ? (props: Partial<P>) => R : unknown

type Num = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '0': 0,
}
type TryCastToNumber<T> = T extends keyof Num ? Num[T] : T
export type ValueByToken<U extends string, T extends U> = U extends `${T}.${infer R}` ? TryCastToNumber<R> : never

export function debounce(func: (...args: any[]) => void, timeout = 300){
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}

export function isEmptyObject(obj: object) {
  for (let _ in obj) {
    return false;
  }
  return true;
}