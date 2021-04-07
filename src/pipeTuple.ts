import { OptionalKeyOf } from './types'
import { PipeFunction, AsyncPipeFunction } from './pipeType'

/**
 * Strictly typed pipes infer their return type by merging return types of all composed functions.
 * Where composed pipe functions provide a property, it is asserted to non-null on the return type.
 * However, there is some declaration overhead, requiring pipe functions to be given as a tuple.
 */
export function pipeTuple <T> (
  fns: PipeFunctionsTuple<T>
) {
  return (props: T) =>
    fns.reduce(async (prev: Promise<T> | T, fn) => {
      const acc = await prev
      const cur = await fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props as T) as Promise<T>
}
