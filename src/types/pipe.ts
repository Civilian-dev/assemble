import { OptionalPick, OptionalKeyOf, ObjectLiteral } from './util'

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
export interface PipeFunction<
  T extends ObjectLiteral,
  K extends OptionalKeyOf<T> | void = void
> {
  (props: T): K extends OptionalKeyOf<T>
    ? OptionalPick<Required<T>, K>
    : void
}

/**
 * Generate function definition that asynchronously operates on the pipe interface.
 * @see PipeFunction — with promise wrapped return.
 */
export interface AsyncPipeFunction<
  T extends ObjectLiteral,
  K extends OptionalKeyOf<T> | void = void
> {
  (props: T): K extends OptionalKeyOf<T>
    ? Promise<OptionalPick<Required<T>, K>>
    : Promise<void>
}

/**
 * Array of (sync or async) pipe functions to spread as pipe args.
 * @example
 *   const funcs: PipeFunctions<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     async () => ({ b: await Promise.resolve(true) })
 *   ]
 */
export type PipeFunctions<
  T extends ObjectLiteral
> = Array<
  PipeFunction<T> |
  AsyncPipeFunction<T>
>

/**
 * Array of synchronous pipe functions to spread as pipe args.
 * @example
 *   const funcs: PipeFunctionsSync<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     () => ({ b: true })
 *   ]
 */
export type PipeFunctionsSync<
  T extends ObjectLiteral
> = PipeFunction<T, OptionalKeyOf<T> | void>[]

/**
 * Get type of parameter for pipe function (with one argument).
 * @example
 *   const pipe = (props: { a: string, b: number }) => null
 *   type FuncInput = PipeInput<typeof pipe>
 *   // ☝️ FuncInput = { a: string, b: number }
 */
// export type PipeInput<Func extends (...args: unknown[]) => unknown> = Parameters<Func>[0]

/**
 * Get the input props type from the first argument to a pipe function.
 * @todo update to extend pipe function and provide example
 */
// export type PipeProps<T extends (...args: unknown[]) => unknown> = Parameters<T>[0]
