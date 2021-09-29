// import { flatObject, isFunction } from './utils'
// import { weakMemoize, primitiveMemoize, mergeObject } from './merge'
import type { FlatObjectReturn, ObjectPaths, ObjectLeaves, Narrow } from './utils'

const originalSymbol = Symbol('original')

type TokensScheme = {
  [key: string]: number | string | TokensScheme
}



type PropertyOptions<Token> = {
  name: string
  token?: Token
  toString: (value: any, bool?: boolean) => string
}

const aaa: TokensScheme = {}


export class DesignSystem<Tokens, Properties> {
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
}






export const theme = new DesignSystem()
.tokens({
  focus: 'white 0px 0px 0px 1px, 0px 0px 2px 3px black',
  font: {
    fontSize: {
      s: 13,
      xs: 11,
    },
  },
  palette: {
    red50:  '#FFEDEE',
    red100: '#FFE6E6',
    red200: '#FFC5C6',
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
  .cssProperties


