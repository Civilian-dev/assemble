import {
  ArrayUnion,
  MapDefined,
  MapReturnType,
  MapUnwrapPromises,
  MergeUnion,
  OptionalKeyOf,
  OptionalPick,
  UnknownFunction,
} from './util'

/**
 * Generate function definition that operates on the assembly interface.
 * @example
 *   interface Props { a?: boolean, b?: boolean }
 *   const assignA: Assembler<Props, 'a'> = () => {
 *     return { a: true }
 *   }
 *   const maybeAssignB: Assembler<Props, 'b' | undefined> = ({ a }) => {
 *     if (a) return { b: true }
 *   }
 *   const useB: Assembler<Props> = ({ b }) => {
 *     console.log(b)
 *   }
 */
export interface Assembler<Props, Key extends OptionalKeyOf<Props> = void> {
  (props: Props): OptionalPick<Required<Props>, Key>
}

/**
 * Generate function definition that asynchronously operates on the assembly interface.
 * @see Assembler — with promise wrapped return.
 */
export interface AsyncAssembler<Props, Key extends OptionalKeyOf<Props> = void> {
  (props: Props): Promise<OptionalPick<Required<Props>, Key>>
}

/**
 * Array of (sync or async) Assembler functions, spread as arguments to Assemble.
 * @example
 *   const funcs: Assemblers<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     async () => ({ b: await Promise.resolve(true) })
 *   ]
 */
export type MixedAssemblers<Props> = Array<
  Assembler<Props, OptionalKeyOf<Props>> |
  AsyncAssembler<Props, OptionalKeyOf<Props>>
>

/**
 * Array of synchronous Assemble functions, spread as arguments to Assemble.
 * @example
 *   const funcs: Assemblers<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     () => ({ b: true })
 *   ]
 */
export type SyncAssemblers<Props> = Array<
  Assembler<Props, OptionalKeyOf<Props>>
>

/** Get intersection of Assembler functions prop types for Assemble input. */
export type AssemblyProps<T extends UnknownFunction[]> =
  MergeUnion<Exclude<Parameters<T[number]>[0], undefined>>

/** Get intersection of all resolved and unconditional assembler function returns. */
export type AssembledProps<T extends UnknownFunction[]> =
  MergeUnion<ArrayUnion<MapDefined<MapUnwrapPromises<MapReturnType<T>>>>>
