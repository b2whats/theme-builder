import { Tokens } from './Tokens'
import type { ObjectPaths, IsPrimitive, TupleOf, UnionToTuple, IsUnion, Paths, PathValue } from './utils'
import { get, memoize } from './utils'

type Nullable<T> = {
  [K in keyof T]?: T[K] | null 
}
export type MaybeTupple<Types, Arity extends number> = Nullable<TupleOf<Types, Arity>> | Types
type Property<Name extends string, AdditionalTypes, Breakpoints extends number = never> = {
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

type MergeTokenValueWithAdditional<TokenValue, Additional= never> = {
  t: 1,
  f: 2,
}[TokenValue extends string | number ? 't' : 'f']
type OTOT = MergeTokenValueWithAdditional<'a' >
type TokenType<T> = IsPrimitive<T> extends true ? boolean : T

type PropertyConfig<TokensPath, AdditionalTypes> = {
  token?: TokensPath
  toString: (value: AdditionalTypes) => string
}

type PropertyValues<Values> = Values extends MaybeTupple<infer Value, number> ? Value : Values
export class Properties<
  DefaultTokens extends Tokens['scheme'],
  List extends Record<string, any> = {},
  Breakpoints extends number = never
> {
  tokens: DefaultTokens
  rules: { [K in keyof List]: (value: PropertyValues<List[K]>, tokens?: DefaultTokens) => string } = {} as any
  breakpointsRule: (tokens: DefaultTokens) => string[] = () => []
  private cache: Map<object, Record<string, Map<any, string>>> = new Map()
  
  constructor({ scheme }: Tokens<DefaultTokens>) {
    this.tokens = scheme
  }

  add<
    Name extends string,
    Token extends Paths<DefaultTokens> = never,
    AdditionalTypes = never,
  >(name: Name, config: PropertyConfig<Token, AdditionalTypes>)
  : Properties<
      DefaultTokens, 
      List &
      Property<
        Name, 
        MergePrimitiveTypes<
          TokenType<PathValue<DefaultTokens, Token>>,
          AdditionalTypes
        >,
        Breakpoints
      >,
      Breakpoints
  > {
    this.rules[name] = (value: any, tokens: any) => {
      if (value === null || value === undefined) return ''

      if (config.token) {
        const tokenValue = value === true
          ? get(tokens, config.token)
          : get(tokens, `${config.token}.${value}`)

        value = tokenValue !== null || tokenValue !== undefined
          ? tokenValue
          : value
      }

      return config.toString(value)
    }

    return this
  }
  
  breakpoints<
    Token extends Paths<DefaultTokens>,
  >(config: Required<PropertyConfig<Token, string>>): Properties<
    DefaultTokens, 
    List,
    UnionToTuple<PathValue<DefaultTokens, Token>>['length']
  > {
    this.breakpointsRule = memoize((tokens: any) => {
      const breakpoints = get(tokens, config.token)
  
      return Array.isArray(breakpoints)
        ? breakpoints.map(config.toString)
        : []
    })

    return this
  }

  pseudoSelectors<
    Selectors extends string
  >(rules: Record<Selectors, (rules: string) => string>): Properties<
    DefaultTokens, 
    List & { [K in Selectors]: Partial<List> & { [K in Selectors]: Partial<List> } },
    Breakpoints
  > {
    this.rules = {
      ...this.rules,
      ...rules,
    }

    return this
  }

  hasCache<
    Name extends keyof List & string
  >(name: Name, value: PropertyValues<List[Name]>, tokens: DefaultTokens): boolean {
    return (this.cache.get(tokens) || {})[name].get(value) !== undefined
  }
  
  compute<
    Name extends keyof List & string
  >(name: Name, value: PropertyValues<List[Name]>, tokens: DefaultTokens = this.tokens): string {
    if (this.rules[name] === undefined) return ''

    let cache = this.cache.get(tokens)

    if (cache === undefined) {
      cache = {}

      for (const rule in this.rules) {
        cache[rule] = new Map()
      }

      this.cache.set(tokens, cache)
    }

    let result = cache[name].get(value)

    if (result === undefined) {
      result = this.rules[name](value, tokens)
      cache[name].set(value, result)
    }

    return result
  }

  list(): List {
    return this as any
  }
}