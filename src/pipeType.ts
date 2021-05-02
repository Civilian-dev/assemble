import { Assign } from 'utility-types'
import {
  Objectify,
  PipeFunctions,
  PipeFunctionsProps,
  PipeFunctionsSync,
  PipeReturnType,
  ReturnTypesIntersection
 } from './types'

/**
 * Apply a series of (potentially async) functions to an interface.
 * Resolves with accumulated outputs and ignores any non-object returns.
 */
// export function pipeType <
//   Props extends object,
//   Funcs extends OptionalPipeFunctionsTuple<Props> = undefined
// > (...fns: PipeFunctions<Props>) {
//   return (props: Props = {} as any) =>
//     fns.reduce(async (prev: Promise<Props> | Props, fn) => {
//       const acc = await prev
//       const cur = await fn(acc)
//       return (typeof cur === 'object')
//         ? { ...acc, ...cur }
//         : acc
//     }, props) as Promise<ExpectedPipeReturnType<Props, Funcs>>
// }

export function reducePipe<
  Props extends {}
> (props: Props, funcs: PipeFunctionsSync<Props>) {
  return funcs.reduce((acc, fn) => {
    const cur = fn(acc)
    return (typeof cur === 'object')
      ? { ...acc, ...cur }
      : acc
  }, props)
}

/**
 * Apply a series of typed pipe functions to a props interface.
 * Returns intersection of input and all function return types (ignores any non-object returns).
 */
export function pipe<
  Props extends PipeFunctionsProps<Funcs>,
  Funcs extends PipeFunctionsSync<any>,
>(...funcs: Funcs): <
  Input extends Props,
  Output extends Input & PipeReturnType<Props, Funcs>
>(props?: Input) => Output {
  return (props = {} as Props) =>
    funcs.reduce((acc, fn) => {
      const cur = fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props)
}

/** @todo props = {} won't work if props has required props, need to check first and default only when none required */

/**
 * Create a pipe to apply a series of typed functions to a given interface.
 * Pipe returns intersection of input and all function return types (ignores any non-object returns).
 */
export function makePipe<
  Props extends object
>() {
  return <Funcs extends PipeFunctionsSync<Props>>(...funcs: Funcs) => pipe<Props, Funcs>()
    // <Input extends Props>(props = {} as Props) => reducePipe(props, funcs) as Input & PipeReturnType<Props, Funcs>
}
