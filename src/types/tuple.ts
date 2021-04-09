import {
  Assign,
  UnionToIntersection
} from 'utility-types'
import {
  TupleUnion,
  FunctionLiteral,
  ObjectLiteral
} from './util'
import {
  MapDefined,
  MapReturnType,
  MapUnwrapPromises
} from './map'
import {
  AsyncPipeFunction,
  PipeFunction,
  PipeFunctions,
  PipeFunctionsSync,
} from './pipe'

/**
 * Readonly Tuple of pipe functions to spread as strict pipe args.
 * @todo @example
 */
export type PipeFunctionsTuple<T extends ObjectLiteral> = ReadonlyArray<
  PipeFunction<T, any> |
  AsyncPipeFunction<T, any>
>

/** @todo Document */
export type TupleReturnTypeIntersection<T extends ReadonlyArray<FunctionLiteral>> =
  UnionToIntersection<TupleUnion<MapDefined<MapUnwrapPromises<MapReturnType<T>>>>>

export type Objectify<T> = T extends object ? T : never

type TestProps = { a?: true, b?: true, c?: true, d?: true }
type TestFunctions = readonly [
  () => { a: true },
  () => Promise<{ b: true }>,
  () => { c?: true },
  // () => { c: true } | undefined, // @todo HANDLE THIS
  () => void,
  () => undefined,
  // () => never // @todo AND THIS
]
type TestReturnProps = Assign<TestProps, TupleReturnTypeIntersection<TestFunctions>>

/** Combine all unconditional returns from pipe functions array (as const) */
export type PipeReturn<
  Funcs extends Readonly<PipeFunctions<Props>>,
  Props extends ObjectLiteral
> = Assign<Props, Objectify<TupleReturnTypeIntersection<Funcs>>> // 🤷‍♂️ Y THO?

// 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉
type TestPipeReturns = PipeReturn<TestFunctions, TestProps>
// 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉

/**
 * Shorthand to type a composed pipe's return type from a tuple of its functions.
 * @example
 *    const pipeFns = [doA, doB, doC] as const
 *    const doPipe: PipeType<IPipe, typeof pipeFns> = pipeType(...pipeFns)
 * @todo Fix ☝️ pipeFns has to be readonly to get return types, but using a readonly array
 *       as the argument to pipeFns causes an error.
 */
export type PipeType<
  Props extends ObjectLiteral,
  Funcs extends Readonly<PipeFunctions<Props>>
> = (props: Props) => Promise<PipeReturn<Funcs, Props>>

/** @todo document... */
export type PipeTypeSync<
  Props extends ObjectLiteral,
  Funcs extends PipeFunctionsTuple<Props>
> = (props: Props) => PipeReturn<Funcs, Props>

/** @todo Make tests for TupleReturnTypeIntersection and the utils it uses */
// const a = () => ({ a: true })
// const b = () => {}
// const c = () => undefined
// const d = () => 'd'
// const e = () => Promise.resolve({ e: true })
// const pipeFuncsTuple = [a, b, c, d, e] as const
// type ABCDE = TupleReturnTypeIntersection<typeof pipeFuncsTuple>
