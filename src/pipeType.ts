import { Assign } from 'utility-types'
import {
  Objectify,
  PipeFunctions,
  PipeFunctionsSync,
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

export function pipeTypeSyncReduce<
  Props extends object
> (props: Props, funcs: PipeFunctionsSync<Props>) {
  return funcs.reduce((acc, fn) => {
    const cur = fn(acc)
    return (typeof cur === 'object')
      ? { ...acc, ...cur }
      : acc
  }, props)
}

/**
 * Apply a series of functions to an interface.
 * Returns accumulated outputs and ignores any non-object returns.
 */
// export function pipeTypeSync<
//   Funcs extends PipeFunctionsSync<any>,
//   Props extends PipeFunctionsProps<Funcs>
// > (...funcs: Funcs): (props: Props) => ExpectedPipeReturnType<Props, Readonly<Funcs>> {
//   return (props: Props = {} as any) => pipeTypeSyncReduce(props, funcs)
// }

// export function pipeTypeInlineSync<
//   Props extends object
// > (funcs: PipeFunctionsSync<Props>): (props: Props) => Props {
//   return (props: Props = {} as any) => pipeTypeSyncReduce(props, funcs)
// }

export type PipeFunctionsProps<Funcs extends PipeFunctions<any>> =
  Funcs extends PipeFunctions<infer Props> ? Props : object

export function pipeTypeSync<
  Props extends PipeFunctionsProps<Funcs>,
  Funcs extends PipeFunctionsSync<any>
// >(...funcs: Funcs): (props?: Props) => PipeReturnType<Props, Funcs> {
>(...funcs: Funcs): (props?: Props) => Assign<
  Objectify<Props>,
  Objectify<ReturnTypesIntersection<Funcs>>
> {
  return (props = {} as any) => pipeTypeSyncReduce(props, funcs)
}

export function pipeTypeInlineSync<
  Props extends object
>(...funcs: PipeFunctionsSync<Props>): (props?: Props) => Props {
  return (props = {} as any) => pipeTypeSyncReduce(props, funcs)
}
