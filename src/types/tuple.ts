import {
  Intersection,
  Mutable,
  PickByValue,
  ReadonlyKeys,
  Subtract,
  Unionize,
  UnionToIntersection
} from 'utility-types'
import {
  AsyncPipeFunction,
  IsNeverType,
  OptionalKeyOf,
  PipeFunction,
  SubType,
  UnwrapPromise
} from '.'
import { Defined } from './util'

/**
 * Map types from tuple (typeof [] as const) to object keys
 * @example
 *   const types = ['foo', 1, true] as const
 *   // ☝️ -> readonly ["foo", 1, true]
 *   type TypesObj = AssignTuple<typeof types>
 *   // ☝️ -> { 0: "foo", 1: 1, 2: true }
 */
 export type AssignTuple<T> = Subtract<
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Pick<Mutable<T>, ReadonlyKeys<T>>,
  PickByValue<Mutable<T>, undefined>
>
/* @todo above compile error is wrong and I can't find another way for it to work 🤷‍♂️  */
/* @todo TS config rule overrides instead of disabling rules. */

/** Readonly Tuple of pipe functions to spread as strict pipe args. */
export type PipeFunctionsTuple<T> = ReadonlyArray<
  PipeFunction<T, OptionalKeyOf<T>> |
  AsyncPipeFunction<T, OptionalKeyOf<T>>
>

/** @todo Documentation/tests - or can it be replaced with Intersection from utility-types */
export type Intersect<T> = T extends { [K in keyof T]: infer E } ? E : T;

/** @todo Make tests for all utils and chains of type utils used in PipeReturn */
const a = () => ({ ok: true })
const b = () => {}
const c = () => undefined
const d = () => 'OK'
const e = () => Promise.resolve(true)
type A = Defined<UnwrapPromise<ReturnType<typeof a>>> // { ok: boolean }
type B = Defined<UnwrapPromise<ReturnType<typeof b>>> // never
type C = Defined<UnwrapPromise<ReturnType<typeof c>>> // never
type D = Defined<UnwrapPromise<ReturnType<typeof d>>> // string
type E = Defined<UnwrapPromise<ReturnType<typeof e>>> // boolean

const pipeFuncsTuple = [a, b, c, d, e] as const

/** Combine all unconditional returns from pipe functions array (as const) */
export type PipeReturn<PipeFunctionsTuple, T> =
  T &
  UnionToIntersection<Intersect<{
    [Key in keyof AssignTuple<PipeFunctionsTuple>]:
      Defined<UnwrapPromise<ReturnType<AssignTuple<PipeFunctionsTuple>[Key]>>>
  }>>

type PRT = PipeReturn<typeof pipeFuncsTuple, {}> // never

/**
 * Shorthand to type a composed pipe's return type from a tuple of its functions.
 * @example
 *    const pipeFns = [doA, doB, doC] as const
 *    const doPipe: PipeType<IPipe, typeof pipeFns> = pipeType(...pipeFns)
 * @todo Fix ☝️ pipeFns has to be readonly to get return types, but using a readonly array
 *       as the argument to pipeFns causes an error.
 */
 export type PipeType<T, PipeFunctionsTuple> =
 (props: T) => Promise<PipeReturn<PipeFunctionsTuple, T>>

/** @todo document... */
export type PipeTypeSync<T, PipeFunctionsTuple> =
 (input: T) => PipeReturn<PipeFunctionsTuple, T>

 