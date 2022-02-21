import { Tokens } from './Tokens'
import type { CastToPrimitive, ObjectPropertiesType, MaybeTupple, UnionToTuple, Paths, PathValue, TokenProps, NoInfer } from './utils'
import { get, memoize } from './utils'

type Property<Name extends string, AdditionalProps, Breakpoints extends number = never> = {
  [key in Name]: [Breakpoints] extends [never]
    ? AdditionalProps | null | undefined
    : MaybeTupple<AdditionalProps | null | undefined, Breakpoints> 
}

type String = (string & {})
type Number = (number & {})
type WithPrimitive<T, P> = 
  T extends P ?
    string extends T ? String :
    number extends T ? Number :
    T :
  T

type MergeTokenValueWithAdditional<TokenValue, Additional> = any extends any
  ? TokenValue | WithPrimitive<Additional, CastToPrimitive<TokenValue>>
  : never

type PropertyConfig<TokensPath, TokenType, AdditionalProps, TokenValue = never> = {
  token?: TokensPath
  tokenType?: TokenType
  cssText: (value: AdditionalProps | ([AdditionalProps] extends [never] ? ObjectPropertiesType<NoInfer<TokenValue>, TokenType extends 'leaves' ? true : false> : never)) => string
}

type BreakpointsConfig<TokensPath> = {
  token: TokensPath
  cssText: (value: string | number) => string
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
    AdditionalProps = never,
    TokenValue = PathValue<DefaultTokens, Token>
  >(name: Name, config: PropertyConfig<Token, Type, AdditionalProps, TokenValue>)
  : Properties<
      DefaultTokens, 
      List & Property<
        Name, 
        MergeTokenValueWithAdditional<
          TokenProps<PathValue<DefaultTokens, Token>, Type>,
          AdditionalProps
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

        value = tokenValue !== null && tokenValue !== undefined
          ? tokenValue
          : value
      }

      return config.cssText ? config.cssText(value) : ''
    }

    return this
  }
  
  breakpoints<
    Token extends Paths<DefaultTokens>,
  >(config: BreakpointsConfig<Token>): Properties<
    DefaultTokens, 
    List,
    UnionToTuple<TokenProps<PathValue<DefaultTokens, Token>, 'single'>>['length']
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


