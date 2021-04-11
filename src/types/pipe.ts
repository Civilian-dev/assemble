import { Assign } from 'utility-types'
import { OptionalPick, OptionalKeyOf, Objectify, ReturnTypesIntersection } from './util'

/**
 * Generate function definition that operates on the pipe interface.
 * @example
 *   interface PipeProps { a?: boolean, b?: boolean }
 *   const assignA: PipeFunction<PipeProps, 'a'> = () => {
 *     return { a: true }
 *   }
 *   const maybeAssignB: PipeFunction<PipeProps, 'b' | undefined> = ({ a }) => {
 *     if (a) return { b: true }
 *   }
 *   const useB: PipeFunction<PipeProps> = ({ b }) => {
 *     console.log(b)
 *   }
 */
export interface PipeFunction<Props, Key extends OptionalKeyOf<Props> = void> {
  (props: Props): OptionalPick<Required<Props>, Key>}

/**
 * Generate function definition that asynchronously operates on the pipe interface.
 * @see PipeFunction — with promise wrapped return.
 */
export interface AsyncPipeFunction<Props, Key extends OptionalKeyOf<Props> = void> {
  (props: Props): Promise<OptionalPick<Required<Props>, Key>>
}

/**
 * Array of (sync or async) pipe functions to spread as pipe args.
 * @example
 *   const funcs: PipeFunctions<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     async () => ({ b: await Promise.resolve(true) })
 *   ]
 */
export type PipeFunctions<Props> = Array<
  PipeFunction<Props, OptionalKeyOf<Props>> |
  AsyncPipeFunction<Props, OptionalKeyOf<Props>>
>

/**
 * Array of synchronous pipe functions to spread as pipe args.
 * @example
 *   const funcs: PipeFunctionsSync<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     () => ({ b: true })
 *   ]
 */
export type PipeFunctionsSync<Props> = Array<
  PipeFunction<Props, OptionalKeyOf<Props>>
>

/** Combine all unconditional returns from pipe functions array (as const) */
export type PipeReturnType<
  Props,
  Funcs extends PipeFunctions<Props>,
> = Assign<
  Objectify<Props>,
  Objectify<ReturnTypesIntersection<Funcs>>
>


// export type OptionalPipeFunctionsTuple<Props> = Readonly<PipeFunctions<Props>> | undefined

// export type ExpectedPipeReturnType<Props, Funcs extends OptionalPipeFunctionsTuple<Props>> =
//   Funcs extends undefined ? Props : PipeReturnType<Props, NonNullable<Funcs>>
