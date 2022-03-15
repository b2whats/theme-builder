import { Tokens } from './Tokens'
import type { ObjectPropertiesType, MaybeTupple, Paths, PathValue, TokenValues, NestedRecord } from './utils'
import { get, memoize } from './utils'

type Property<Name extends string, Values, Breakpoints extends number = never> = {
  [key in Name]: [Breakpoints] extends [never]
    ? Values
    : MaybeTupple<Values, Breakpoints> 
}

type String = (string & {})
type Number = (number & {})

type AdditionalList = string | number | StringConstructor | NumberConstructor | BooleanConstructor
type AdditionalType<T> = 
  T extends StringConstructor ? String :
  T extends NumberConstructor ? Number :
  T extends BooleanConstructor ? boolean :
  T
type FilterBrandPrimitive<T> =
  T extends String ? string :
  T extends Number ? number :
  T

type PropertyConfig<TokensPath, TokenType, AdditionalValues, TokenValue = never> = {
  additionalValues?: AdditionalValues[],
  cssText: (value: FilterBrandPrimitive<AdditionalType<AdditionalValues> | ([TokensPath] extends [never] ? never : ObjectPropertiesType<TokenValue, TokenType extends 'leaves' ? true : false>)>) => string
} & ({
  token: TokensPath
  tokenType?: TokenType
} | {
  token?: never
  tokenType?: never
})

type BreakpointsConfig<TokensPath> = {
  token: TokensPath
  media: (value: string | number) => string
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
    Type extends 'single' | 'leaves' = 'leaves',
    AdditionalValues extends AdditionalList = never,
    TokenValue = PathValue<DefaultTokens, Token>
  >(name: Name, config: PropertyConfig<Token, Type, AdditionalValues, TokenValue>)
  : Properties<
      DefaultTokens, 
      List & Property<
        Name,
        TokenValues<TokenValue, Type> | AdditionalType<AdditionalValues>,
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

        value = tokenValue !== null && tokenValue !== undefined
          ? tokenValue
          : value
      }

      return config.cssText(value)
    }

    return this
  }
  
  breakpoints<
    Token extends Paths<DefaultTokens>,
    TokenValue = PathValue<DefaultTokens, Token> 
  >(config: BreakpointsConfig<Token>): Properties<
    DefaultTokens, 
    List,
    TokenValue extends any[] ? TokenValue['length'] : never
  > {
    this.breakpointsRule = memoize((tokens: any) => {
      const breakpoints = get(tokens, config.token)
  
      return Array.isArray(breakpoints)
        ? breakpoints.map(config.media)
        : []
    })

    return this
  }

  complexSelectors<
    Selectors extends string = never
  >(rules?: Record<Selectors, (rules: string) => string>): Properties<
    DefaultTokens, 
    List & NestedRecord<Selectors | `&${string}`, Partial<List>, 2>,
    Breakpoints
  > {
    Object.assign(this.rules, rules)

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


