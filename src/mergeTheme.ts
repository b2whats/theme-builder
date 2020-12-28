import { ThemeBuilder } from './ThemeBuilder'

const isObject = (value: any): value is object => value && value.constructor && value.constructor === Object
const isThemeBuilder = (value: any): value is ThemeBuilder<any> => value instanceof ThemeBuilder

function cloneUnlessOtherwiseSpecified(value: any) {
	return isObject(value)
		? mergeObject({}, value)
		: value
}

export function mergeObject(target: object, source: object): object {
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

const weakMemoize = <Arg extends object, Return>(func: UnaryFn<Arg, Return>): UnaryFn<Arg, Return> => {
  let cache = new WeakMap()
  
  return arg => {
    if (cache.has(arg)) return cache.get(arg)

    let result = func(arg)
    cache.set(arg, result)
    
    return result
  }
}

let createCacheWithTheme = weakMemoize(outerTheme => {
  return weakMemoize(theme => {
    return mergeObject(outerTheme, theme)
  })
})

export function mergeTheme<T extends object>(target: T, source: object | void): T {
  if (!source) return target

  return createCacheWithTheme(target)(source) as T
}