import { isObject, isThemeBuilder } from './utils'

function cloneUnlessOtherwiseSpecified(value: any) {
	return isObject(value)
		? mergeObject({}, value)
		: value
}

export function mergeObject(target: object, source: object): Record<string, any> {
  const result = {}

  Object.keys(target).forEach((key) => {
    result[key] = cloneUnlessOtherwiseSpecified(target[key])
  })

  Object.keys(source).forEach((key) => {
    const targetValue = target[key]
    const sourceValue = source[key]
    
    if (isThemeBuilder(targetValue) && isThemeBuilder(sourceValue)) {
      result[key] = targetValue.merge(sourceValue)
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = mergeObject(targetValue, sourceValue)
    } else {
      result[key] = cloneUnlessOtherwiseSpecified(sourceValue)
    }
  })

  return result
}

type UnaryFn<Arg, Return> = (arg: Arg) => Return

export const weakMemoize = <Arg extends object, Return>(func: UnaryFn<Arg, Return>): UnaryFn<Arg, Return> => {
  let cache = new WeakMap()
  
  return arg => {
    if (cache.has(arg)) return cache.get(arg)

    let result = func(arg)
    cache.set(arg, result)
    
    return result
  }
}

export const primitiveMemoize = <Arg extends string | number | null | undefined, Return>(func: UnaryFn<Arg, Return>): UnaryFn<Arg, Return> => {
  let cache = {} as any
  
  return arg => {
    if (cache[arg]) return cache[arg]

    let result = func(arg)
    cache[arg] = result
    
    return result
  }
}

export const memoize = <Arg extends any, Return>(func: UnaryFn<Arg, Return>): UnaryFn<Arg, Return> => {
  let cache = new Map()
  
  return arg => {
    if (arg === undefined) return func(arg)

    const hash = JSON.stringify(arg)

    if (cache.has(hash)) return cache.get(hash)

    let result = func(arg)
    cache.set(hash, result)
    
    return result
  }
}

const createCacheWithTheme = weakMemoize(outerTheme => {
  return weakMemoize(theme => {
    if (isObject(outerTheme) && isObject(theme)) {
      return mergeObject(outerTheme, theme)
    } else {
      return outerTheme
    }
  })
})

export function mergeTheme<T extends object>(target: T, source?: object): T {
  // return createCacheWithTheme(target)(source) as T
  return '' as any
}