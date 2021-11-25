import { isObject, isFunction, isString } from './utils'

const emptyCache = {}
const cache: Map<object, Map<object, object>> = new Map()

export const mergeTheme = (a: object = emptyCache, b: object = emptyCache) => {
  let cacheA = cache.get(a)

  if (cacheA === undefined) {
    cacheA = new Map()
    cache.set(a, cacheA)
  }

  let cacheB = cacheA.get(b)

  if (cacheB === undefined) {
    cacheB = mergeObject(a, b, {
      mapProps: (a, b) => {
        if (isFunction(a) && isFunction(b)) {
          return (props: any) => ({
            ...a(props),
            ...b(props),
          })
        }
        return b
      },
      asString: (a, b) => {
        if (isString(a) && isString(b)) {
          return a + b
        }
        return b
      },
    }, { removeEmpty: true })
    cacheA.set(b, cacheB)
  }

  return cacheB
}

function cloneUnlessOtherwiseSpecified(value: any) {
	return isObject(value)
		? mergeObject({}, value)
		: value
}

type CustomMerge = {
  [key: string]: (a: unknown, b: unknown) => any,
}
type OptionsMerge = {
  removeEmpty?: any,
}

function mergeObject(target: object, source: object, customMerge: CustomMerge = {}, options: OptionsMerge = {}): Record<string, any> {
  const result = {}

  Object.keys(target).forEach((key) => {
    result[key] = cloneUnlessOtherwiseSpecified(target[key])
  })

  Object.keys(source).forEach((key) => {
    const targetValue = target[key]
    const sourceValue = source[key]
    
    if (customMerge[key]) {
      result[key] = customMerge[key](targetValue, sourceValue)
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = mergeObject(targetValue, sourceValue, customMerge, options)
    } else {
      result[key] = cloneUnlessOtherwiseSpecified(sourceValue)
    }
    
    if (options.removeEmpty && result[key] == null) {
      delete result[key]
    }
  })

  return result
}