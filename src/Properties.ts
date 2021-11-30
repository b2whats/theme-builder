import { Tokens } from './Tokens'
import type { ObjectPaths, FlattenObjectType, TupleOf, UnionToTuple, IsUnion } from './utils'
import { get, memoize } from './utils'

type Nullable<T> = {
  [K in keyof T]?: T[K] | null 
}
type MaybeTupple<Types, Arity extends number> = Nullable<TupleOf<Types, Arity>> | Types
type ComputedProperty<Name extends string, AdditionalTypes, Breakpoints extends number = never> = {
  [key in Name]: [Breakpoints] extends [never]
    ? AdditionalTypes | null | undefined
    : MaybeTupple<AdditionalTypes | null | undefined, Breakpoints> 
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

type PropertyValues<Values> = Values extends MaybeTupple<infer Values, number> ? Values : Values


export class Properties<DefaultTokens extends Record<string, any>, List extends Record<string, any> = {}, Breakpoints extends number = never> {
  tokens: DefaultTokens
  rules: { [K in keyof List]: (value: List[K], tokens?: this['tokens']) => string } = {} as any
  private breakpointsRule!: {
    token: string
    toString: (value: string | number) => string
  }
  private cache: Map<object, Record<string, Map<any, string>>> = new Map()
  
  constructor(tokens: Tokens<DefaultTokens>) {
    this.tokens = tokens.scheme
    this.breakpointsRules = memoize(this.breakpointsRules.bind(this))
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
    this.rules[name] = (value: any, tokens: any) => {
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
  >(config: PropertyConfig<Token, string | number>)
  : Properties<
      DefaultTokens, 
      List,
      UnionToTuple<TokensPathObject[Token]>['length']
  > {
    this.breakpointsRule = config as any

    return this
  }

  breakpointsRules(tokens: this['tokens']): string[] {
    const result: string[] = []
    const breakpoints = get(tokens, this.breakpointsRule.token)
    if (Array.isArray(breakpoints)) {
      for (let index = 1; index < breakpoints.length; index++) {
        result.push(this.breakpointsRule.toString(breakpoints[index]))
      }
    }

    return result
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

  hasCache<
    Name extends keyof List
  >(name: Name, value: PropertyValues<List[Name]>, tokens: DefaultTokens): boolean {
    return (this.cache.get(tokens) || {})[name as string].get(this.hashValue(value)) !== undefined
  }
  
  compute<
    Name extends keyof List
  >(name: Name, value?: PropertyValues<List[Name]> | null, tokens: this['tokens'] = this.tokens): string {
    if (!this.rules[name] || value === null || value === undefined) return ''
    
    let cache = this.cache.get(tokens)

    if (cache === undefined) {
      cache = Object.keys(this.rules).reduce((acc, rule) => {
        acc[rule] = new Map()

        return acc
      }, {})

      this.cache.set(tokens, cache)
    }

    let result = cache[name as string].get(value)

    if (result === undefined) {
      result = this.rules[name](value, tokens)

      cache[name as string].set(value, result)
    }

    return result
  }

  list(): List {
    return this as any
  }
}
