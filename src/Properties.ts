import { Tokens } from './Tokens'
import type { ObjectPaths, FlattenObjectType, UnionLast, TupleOf, UnionToTuple, IsUnion } from './utils'
import { get } from './utils'

export type NoInfer<T> = T & {[K in keyof T]: T[K]};
type MaybeArray<T, N extends number> = Partial<TupleOf<T, N>> | T
type ComputedProperty<Name extends string, AdditionalTypes, Breakpoints extends number = never> = {
  [key in Name]: MaybeArray<
    AdditionalTypes,
    Breakpoints
  >
}

type String = (string & {})
type Number = (number & {})
type WithPrimitive<T, P> = 
  T extends string ? P extends T ? String : T :
  T extends number ? P extends T ? Number : T :
  T

type Every<T, P> = T extends P ? true : unknown
type MergePrimitiveTypes<A, B> = IsUnion<A> extends true
  ? Every<A, string> extends true
    ? WithPrimitive<B, string> | A
    : WithPrimitive<B, number> | A
  : A | B
type TokensValueType<T> = IsUnion<T> extends true ? T : T extends never ? never : boolean

type PropertyConfig<TokensPath, AdditionalTypes = never> = {
  token?: TokensPath
  toString: (value: AdditionalTypes) => string
}

export class Properties<DefaultTokens extends {}, List = {}, Breakpoints extends number = never> {
  tokens: DefaultTokens
  rules: { [K in keyof List]: (value: List[K], tokens?: DefaultTokens) => string } = {} as any
  memo: Map<DefaultTokens, Record<string, string | string[]>> = new Map()
  memo2: Map<DefaultTokens, Record<string, Map<any, string | string[]>>> = new Map()
  
  constructor(tokens: Tokens<DefaultTokens>) {
    this.tokens = tokens.scheme
    this.memo.set(this.tokens, {})
  }

  private hashValue<T>(value: T): T | string  {
    return Array.isArray(value) ? value.join('|') : value
  }

  add<
    Name extends string,
    Token extends keyof TokensPathObject = never,
    AdditionalTypes = never,
    TokensPathObject = ObjectPaths<DefaultTokens>
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
    this.rules[name as string] = (value: any, tokens: DefaultTokens = this.tokens) => {
      if (value === null || value === undefined) return ''

      if (config.token) {
        value = (typeof value === 'boolean' ? value &&  get(tokens, config.token as string) : get(tokens, `${config.token}.${value}`)) || value
      }

      return config.toString(value)
    }

    return this as any
  }
  
  breakpoints<
    Token extends keyof TokensPathObject = never,
    TokensPathObject = ObjectPaths<DefaultTokens>
  >(config: PropertyConfig<Token>)
  : Properties<
      DefaultTokens, 
      List,
      UnionToTuple<TokensPathObject[Token]>['length']
  > {
    return this as any
  }

  states<
    State extends string
  >(data: Record<State, (rules: string) => string>): Properties<
    DefaultTokens, 
    List & { [K in keyof typeof data]: Partial<List> },
    Breakpoints
  > {
    this.rules = {
      ...this.rules,
      ...data,
    }
    
    return this as any
  }

  // hasCache2<
  //   Name extends keyof List
  // >(name: Name, value: List[Name], tokens: DefaultTokens): boolean {
  //   return (this.memo.get(tokens) || {})[name + '/' + value] !== undefined
  // }

  hasCache<
    Name extends keyof List
  >(name: Name, value: List[Name], tokens: DefaultTokens): boolean {
    return (this.memo2.get(tokens) || {})[name as string].get(this.hashValue(value)) !== undefined
  }
  
  // compute2<
  //   Name extends keyof List
  // >(name: Name, value: List[Name], tokens: DefaultTokens = this.tokens): string | string[] {
  //   const tokenCache = this.memo.get(tokens)
  //   const cacheKey = name + '/' + value
  //   const cacheValue = tokenCache && tokenCache[cacheKey]
    
  //   if (cacheValue !== undefined) {
  //     return cacheValue
  //   } else {
  //     let result

  //     if (Array.isArray(value)) {
  //       result = []

  //       for (let i = 0; i < value.length; i++) {
  //         result.push(this.rules[name](value[i], tokens))
  //       }
  //     } else {
  //       result = this.rules[name](value, tokens)
  //     }

  //     if (tokenCache !== undefined) {
  //       tokenCache[cacheKey] = result
  //     } else {
  //       this.memo.set(tokens, {[cacheKey]: result})
  //     }

  //     return result
  //   }
  // }

  compute<
    Name extends keyof List
  >(name: Name, value: List[Name], tokens: DefaultTokens = this.tokens): string | string[] {
    let cache = this.memo2.get(tokens)

    if (cache === undefined) {
      cache = Object.keys(this.rules).reduce((acc, rule) => {
        acc[rule] = new Map()

        return acc
      }, {})

      this.memo2.set(tokens, cache)
    }

    let result = cache[name as string].get(this.hashValue(value))

    if (result === undefined) {
      if (Array.isArray(value)) {
        result = []

        for (let i = 0; i < value.length; i++) {
          result.push(this.rules[name](value[i], tokens))
        }
      } else {
        result = this.rules[name](value, tokens)
      }

      cache[name as string].set(this.hashValue(value), result)
    }

    return result
  }

  list(): List {
    return this as any
  }
}
