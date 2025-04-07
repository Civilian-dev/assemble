import type {
	ArrayUnion,
	FilterObjects,
	MapReturnType,
	MapUnwrapPromises,
	MergeUnion,
	NonPartial,
	UnknownFunction,
} from './util'

/**
 * Function that operates on assembly props, returning subset of props.
 * @example
 *   type Props = { a: boolean, b: boolean }
 *   const assignA: Assembler<Props, 'a'> = () => {
 *     return { a: true }
 *   }
 */
export type Assembler<Props, Key extends keyof Props> = (
	props: Props,
) => Pick<NonPartial<Props>, Key>

/**
 * Function that operates on assembly props, optionally returning subset of props.
 * @example
 *   type Props = { a?: boolean, b?: boolean }
 *   const maybeAssignB: PartialAssembler<Props, 'b'> = ({ a }) => {
 *     if (a) return { b: true }
 *   }
 */
export type PartialAssembler<Props, Key extends keyof Props> = (
	props: Props,
) => Partial<Pick<Props, Key>> | undefined

/**
 * Function that operates on assembly props, returning void.
 * @example
 *   type Props = { a?: boolean, b?: boolean }
 *   const useB: NonAssembler<Props> = ({ b }) => {
 *     console.log(b)
 *   }
 */
export type NonAssembler<Props> = (props: Props) => undefined

/**
 * Array of synchronous Assemble functions, spread as arguments to Assemble.
 * @example
 *   const funcs: Assemblers<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     () => ({ b: true })
 *   ]
 */
export type SyncAssemblers<Props> = Array<
	| Assembler<Props, keyof Props>
	| PartialAssembler<Props, keyof Props>
	| NonAssembler<Props>
>

/**
 * Async function that operates on assembly props, resolves to subset of props.
 * @see Assembler — with promise wrapped return.
 */
export type AsyncAssembler<Props, Key extends keyof Props> = (
	props: Props,
) => Promise<NonPartial<Pick<Props, Key>>>

/**
 * Function that operates on assembly props, optionally resolving to subset of props.
 * @see PartialAssembler
 */
export type AsyncPartialAssembler<Props, Key extends keyof Props> = (
	props: Props,
) => Promise<Partial<Pick<Props, Key>> | undefined>

/**
 * Async function that operates on assembly props, resolves to void.
 * @see NonAssembler
 */
export type AsyncNonAssembler<Props> = (props: Props) => Promise<void>

/**
 * Array of (sync or async) Assembler functions, spread as arguments to Assemble.
 * @example
 *   const funcs: Assemblers<{ a: any, b: any }> = [
 *     () => ({ a: true }),
 *     async () => ({ b: await Promise.resolve(true) })
 *   ]
 */
export type MixedAssemblers<Props> = Array<
	| Assembler<Props, keyof Props>
	| AsyncAssembler<Props, keyof Props>
	| PartialAssembler<Props, keyof Props>
	| AsyncPartialAssembler<Props, keyof Props>
	| NonAssembler<Props>
	| AsyncNonAssembler<Props>
>

/** Get intersection of Assembler functions prop types for Assemble input. */
export type AssemblyProps<T extends UnknownFunction[]> = MergeUnion<
	Exclude<Parameters<T[number]>[0], undefined>
>

/** Get intersection of all resolved and unconditional assembler function returns. */
export type AssembledProps<T extends UnknownFunction[]> = MergeUnion<
	ArrayUnion<FilterObjects<MapUnwrapPromises<MapReturnType<T>>>>
>
