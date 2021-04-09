import { ObjectLiteral, PipeFunctions, PipeFunctionsSync } from './types'

/**
 * Apply a series of (potentially async) functions to an interface.
 * Resolves with accumulated outputs and ignores any non-object returns.
 */
export function pipeType <
  T extends ObjectLiteral
> (...fns: PipeFunctions<T>) {
  return (props: T) =>
    fns.reduce(async (prev: Promise<T> | T, fn) => {
      const acc = await prev
      const cur = await fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props as T) as Promise<T>
}

/**
 * Apply a series of functions to an interface.
 * Returns accumulated outputs and ignores any non-object returns.
 */
export function pipeTypeSync <
  T extends ObjectLiteral
> (...fns: PipeFunctionsSync<T>) {
  return (props: T) =>
    fns.reduce((acc, fn) => {
      const cur = fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props as T)
}
