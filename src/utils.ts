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


export type ObjectPaths<O extends Record<string, any>, Entries extends [string, any] = PathsEntries<O>> = FlattenType<{ [K in Entries as K[0] ]: K[1] }>
export type ObjectLeaves<O extends Record<string, any>, Entries extends [string, any] = LeavesEntries<O>> = { [K in Entries as K[0] ]: K[1] }

type UnionToIntersection<U> =   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type UnionToFunctions<U> = U extends unknown ? (k: U) => void : never

export type IsUnion<T> = boolean extends T ? false :
  [T] extends [UnionToIntersection<T>] ? false : true

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
type IfTupleOrArrayToObject<T> = Omit<T, 
  T extends any[] // T array or tuple
    ? Exclude<keyof any[], any[] extends T ? number : never> // if array leave the number
    : never
>

export type Paths<T> = (T extends object
  ? { [K in keyof IfTupleOrArrayToObject<T> & (string | number)]: `${K}${DotPrefix<Paths<T[K]>>}` | `${K}` }[keyof IfTupleOrArrayToObject<T> & (string | number)]
  : ''
) extends infer D ? Extract<D, string> : never

type TRRE = IfTupleOrArrayToObject<{a: 1}>
type Test = {
  nestedObj: {
    a: {
      a1: number
    }
    b: string
  }
  arr: [number, string]
  nestedTuple: [{ a: 1}, { b: 2 }]
  nestedArr: { a: 1}[]
  nestedNumberObject: {
    1?: number
    2: string
  }
}
type OPaths = Paths<Test>

type PathToTuple<Path> = Path extends `${infer Key}.${infer Rest}`
  ? [TryCastToNumber<Key>, Rest]
  : [TryCastToNumber<Path>, never]

type OrUndefinedPath<T> = T extends undefined ? undefined : never
export type PathValue<Data, Path, MaybeUndefined = never> = PathToTuple<Path> extends [infer Key, infer Rest] ? 
  Key extends keyof Data
    ? [Rest] extends [never]
      ? Data[Key] extends object | undefined ? TryCastToNumber<Paths<NonNullable<Data[Key]>>> : Data[Key] | MaybeUndefined
      : PathValue<NonNullable<Data[Key]>, Rest, [MaybeUndefined] extends [never] ? OrUndefinedPath<Data[Key]> : MaybeUndefined>
    : never
: never

export type IsPrimitive<T> = 
  unknown extends T ? false :
  number extends T ? true :
  string extends T ? true :
  false

type ye = IsPrimitive<never>
type Val = PathValue<Test, 'nestedTuple'>
type Val1 = PathValue<Test, 'nestedArr'>
type Val3 = PathValue<Test, 'nestedObj.a.a1'>
type Val2 = PathValue<Test, 'nestedNumberObject.1'>

type arr = 1 extends keyof Test['nestedTuple'] ? 1 : 2
type WQ = [1, 2, 3] extends any[] ? 1 : 2
type WQ1 = any[] extends (1 | 2 | 3)[] ? 1 : 2

export type ComponentType<T = any, R = null | undefined> = (props: T) => R
export type FunctionPartialAttr<T> = T extends ComponentType<infer P, infer R> ? ComponentType<Partial<P>, R> : unknown



type CreateNumberList<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N ? Result : CreateNumberList<N, [...Result, Result['length']]>

type NumberList = CreateNumberList<30>

type TryCastToNumber<T> = T extends keyof NumberList ? NumberList[T] : T
export type ValueByToken<U extends string, T extends U> = U extends `${T}.${infer R}` ? TryCastToNumber<R> : never

export function debounce<V extends any[], R>(func: (...args: V) => R, timeout = 300){
  let timer: NodeJS.Timeout

  return (...args: V) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), timeout)
  }
}

export function isEmptyObject(obj: object) {
  for (let _ in obj) {
    return false
  }
  return true
}
