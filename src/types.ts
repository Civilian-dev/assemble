import {
  ArrayUnion,
  MapReturnType,
  MapUnwrapPromises,
  MergeUnion,
  FilterObjects,
  UnknownFunction
} from './util'

/**
 * Function that operates on assembly props, returning subset of props.
 * @example
 *   interface Props { a?: boolean, b?: boolean }
 *   const assignA: Assembler<Props, 'a'> = () => {
 *     return { a: true }
 *   }
 */
export interface Assembler<Props, Key extends keyof Props> {
  (props: Props): Required<Pick<Props, Key>>
}

/**
 * Function that operates on assembly props, optionally returning subset of props.
 * @example
 *   interface Props { a?: boolean, b?: boolean }
 *   const maybeAssignB: PartialAssembler<Props, 'b' | undefined> = ({ a }) => {
 *     if (a) return { b: true }
 *   }
 */
export interface PartialAssembler<Props, Key extends keyof Props> {
  (props: Props): Partial<Pick<Props, Key>>
}

/**
 * Function that operates on assembly props, returning void.
 * @example
 *   interface Props { a?: boolean, b?: boolean }
 *   const useB: VoidAssembler<Props> = ({ b }) => {
 *     console.log(b)
 *   }
 */
export interface VoidAssembler<Props> {
  (props: Props): void
}

/**
 * Array of synchronous Assemble functions, spread as arguments to Assemble.
 * @example
 *   const funcs: Assemblers<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     () => ({ b: true })
 *   ]
 */
export type SyncAssemblers<Props> = Array<
  Assembler<Props, keyof Props> |
  PartialAssembler<Props, keyof Props> |
  VoidAssembler<Props>
>

/**
 * Async function that operates on assembly props, resolves to subset of props.
 * @see Assembler — with promise wrapped return.
 */
export interface AsyncAssembler<Props, Key extends keyof Props> {
  (props: Props): Promise<Required<Pick<Props, Key>>>
}

/**
 * Function that operates on assembly props, optionally resolving to subset of props.
 * @see PartialAssembler
 */
export interface AsyncPartialAssembler<Props, Key extends keyof Props> {
  (props: Props): Partial<Pick<Props, Key>>
}

/**
 * Async function that operates on assembly props, resolves to void.
 * @see VoidAssembler
 */
export interface AsyncVoidAssembler<Props> {
  (props: Props): void
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
 Assembler<Props, keyof Props> |
 AsyncAssembler<Props, keyof Props> |
 PartialAssembler<Props, keyof Props> |
 AsyncPartialAssembler<Props, keyof Props> |
 VoidAssembler<Props> |
 AsyncVoidAssembler<Props>
>

/** Get intersection of Assembler functions prop types for Assemble input. */
export type AssemblyProps<T extends UnknownFunction[]> =
  MergeUnion<Exclude<Parameters<T[number]>[0], undefined>>

/** Get intersection of all resolved and unconditional assembler function returns. */
export type AssembledProps<T extends UnknownFunction[]> =
  MergeUnion<ArrayUnion<FilterObjects<MapUnwrapPromises<MapReturnType<T>>>>>
