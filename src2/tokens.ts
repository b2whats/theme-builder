import { flatObject } from './utils'

export const createBaseToken = <T extends object>(shape: T) => flatObject(shape, '.')