type TokensScheme = {
  [key: string]: number | string | TokensScheme | (number | string)[] | []
}

export class Tokens<Scheme extends TokensScheme = {}> {
  constructor(public scheme: Scheme) {}
}

