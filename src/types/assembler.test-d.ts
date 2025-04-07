import { assertType, describe, expectTypeOf, test } from 'vitest'
import { assemble, assembleSync } from '../assemble'
import type {
	AssembledProps,
	Assembler,
	AssemblyProps,
	AsyncAssembler,
	AsyncPartialAssembler,
	NonAssembler,
	PartialAssembler,
	SyncAssemblers,
} from './assembler'

describe('Assembler', () => {
	describe('All return types', () => {
		test('NonAssembler can not return void', () => {
			expectTypeOf((props: { a: boolean }) => {
				console.log(props.a)
			}).not.toMatchTypeOf<NonAssembler<{ a: boolean }>>()
		})
		test('NonAssembler can return undefined', () => {
			expectTypeOf((props: { a: boolean }) => {
				console.log(props.a)
				return undefined
			}).toMatchTypeOf<NonAssembler<{ a: boolean }>>()
		})
		/**
		 * @todo This doesn't work because all async functions can return void. */
		// test('AsyncNonAssembler can not return void', () => {
		// 	expectTypeOf(async (props: { a: boolean }) => {
		// 		console.log(props.a)
		// 	}).not.toMatchTypeOf<AsyncNonAssembler<{ a: boolean }>>()
		// })
		test('Assembler returns subset of props', () => {
			expectTypeOf((_props: { a: boolean }) => ({ a: true })).toMatchTypeOf<
				Assembler<{ a: boolean }, 'a'>
			>()
		})
		test('PartialAssembler optionally can return subset of props', () => {
			expectTypeOf((_props: { a: boolean }) => ({ a: true })).toMatchTypeOf<
				PartialAssembler<{ a: boolean }, 'a'>
			>()
		})
		test('PartialAssembler optionally can return undefined', () => {
			expectTypeOf((_props: { a: boolean }) => undefined).toMatchTypeOf<
				PartialAssembler<{ a: boolean }, 'a'>
			>()
		})
		test('PartialAssembler can return empty object', () => {
			expectTypeOf((_props: { a: boolean }) => ({})).toMatchTypeOf<
				PartialAssembler<{ a: boolean }, 'a'>
			>()
		})
		test('AsyncAssembler returns subset of props', () => {
			expectTypeOf(async (_props: { a: boolean }) => ({
				a: true,
			})).toMatchTypeOf<AsyncAssembler<{ a: boolean }, 'a'>>()
		})
		test('AsyncPartialAssembler optionally can return subset of props', () => {
			expectTypeOf(async (_props: { a: boolean }) => ({
				a: true,
			})).toMatchTypeOf<AsyncPartialAssembler<{ a: boolean }, 'a'>>()
		})
		test('AsyncPartialAssembler optionally can return undefined', () => {
			expectTypeOf(async (_props: { a: boolean }) => undefined).toMatchTypeOf<
				AsyncPartialAssembler<{ a: boolean }, 'a'>
			>()
		})
		test('AsyncPartialAssembler can return empty object', () => {
			expectTypeOf(async (_props: { a: boolean }) => ({})).toMatchTypeOf<
				AsyncPartialAssembler<{ a: boolean }, 'a'>
			>()
		})
	})
	describe('Assembler', () => {
		test('Creates function type that returns subset of props', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleA = Assembler<Props, 'a'>
			expectTypeOf(() => ({ a: true })).toMatchTypeOf<AssembleA>()
		})
		test('Does not allow asynchronous assemblers', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleA = Assembler<Props, 'a'>
			expectTypeOf(async () => ({ a: true })).not.toMatchTypeOf<AssembleA>()
		})
		test('Returned attributes are non-optional', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleA = Assembler<Props, 'a'>
			expectTypeOf<{ a: boolean }>().toEqualTypeOf<ReturnType<AssembleA>>()
		})
	})

	describe('PartialAssembler', () => {
		test('Creates function type that optionally returns subset of props', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleB = PartialAssembler<Props, 'b'>
			expectTypeOf(() => ({ b: true })).toMatchTypeOf<AssembleB>()
			expectTypeOf(() => undefined).toMatchTypeOf<AssembleB>()
		})
		test('Does not allow asynchronous assemblers', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleB = PartialAssembler<Props, 'b'>
			expectTypeOf(async () => ({ b: true })).not.toMatchTypeOf<AssembleB>()
		})
		test('Returned attributes are optional', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleB = PartialAssembler<Props, 'b'>
			expectTypeOf<{ b?: boolean } | undefined>().toEqualTypeOf<
				ReturnType<AssembleB>
			>()
		})
	})

	describe('NonAssembler', () => {
		test('Creates function type that does not return props', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleNone = NonAssembler<Props>
			expectTypeOf(() => undefined).toMatchTypeOf<AssembleNone>()
		})
		test('Does not allow asynchronous assemblers', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleNone = NonAssembler<Props>
			expectTypeOf(async () => {}).not.toMatchTypeOf<AssembleNone>()
		})
		test('Returned attributes are void', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleNone = NonAssembler<Props>
			expectTypeOf<undefined>().toEqualTypeOf<ReturnType<AssembleNone>>()
		})
	})

	describe('SyncAssemblers', () => {
		test('Makes a union of synchronous assembler function types', () => {
			type Props = { a?: boolean; b?: boolean; c?: boolean }
			type AssembleA = Assembler<Props, 'a'>
			const assembleA = () => ({ a: true })

			type AssembleB = PartialAssembler<Props, 'b'>
			const assembleB = () => {
				if (Math.random() > 0.5) return { b: true }
				return
			}

			type AssembleNone = NonAssembler<Props>
			const assembleNone = () => {
				return undefined
			}

			type AssembleC = AsyncAssembler<Props, 'c'>
			const assembleC = async () => ({ c: await Promise.resolve(true) })

			expectTypeOf<AssembleA[]>().toMatchTypeOf<SyncAssemblers<Props>>()
			expectTypeOf([assembleA]).toMatchTypeOf<SyncAssemblers<Props>>()

			expectTypeOf<AssembleB[]>().toMatchTypeOf<SyncAssemblers<Props>>()
			expectTypeOf([assembleB]).toMatchTypeOf<SyncAssemblers<Props>>()

			expectTypeOf<AssembleNone[]>().toMatchTypeOf<SyncAssemblers<Props>>()
			expectTypeOf([assembleNone]).toMatchTypeOf<SyncAssemblers<Props>>()

			expectTypeOf<AssembleC[]>().not.toMatchTypeOf<SyncAssemblers<Props>>()
			expectTypeOf([assembleC]).not.toMatchTypeOf<SyncAssemblers<Props>>()
		})
	})

	describe('AsyncAssembler', () => {
		test('Returned attributes are non-optional in result', async () => {
			type NumberProps = { one?: boolean; two?: boolean }
			type LetterProps = { a?: boolean; b?: boolean }

			const asyncAssignOne: AsyncAssembler<NumberProps, 'one'> = async () => ({
				one: true,
			})

			const asyncAssignA: AsyncAssembler<LetterProps, 'a'> = async () => ({
				a: true,
			})

			const result = await assemble(asyncAssignOne, asyncAssignA)({})

			assertType<{
				a: boolean
				b?: boolean
				one: boolean
				two?: boolean
			}>(result)
		})
	})

	describe('MixedAssemblers', () => {
		test('Returned attributes are non-optional in result', () => {
			type NumberProps = { one?: boolean; two?: boolean }
			type LetterProps = { a?: boolean; b?: boolean }

			const assignOneAndTwo: Assembler<NumberProps, 'one' | 'two'> = () => ({
				one: true,
				two: true,
			})

			const assignPartialA: PartialAssembler<
				LetterProps & NumberProps,
				'a'
			> = ({ one }) => ({ a: one ?? true })

			const assignPartialB: PartialAssembler<LetterProps, 'b'> = ({ a }) => {
				if (a) return { b: true }
				return
			}

			const logAssembly: NonAssembler<NumberProps & LetterProps> = (props) => {
				console.log(props)
			}

			const mixedAssembly = assembleSync(
				assignOneAndTwo,
				assignPartialA,
				assignPartialB,
				() => ({ foo: true }),
				logAssembly,
			)

			type Result = ReturnType<typeof mixedAssembly>

			expectTypeOf<Result>().toEqualTypeOf<{
				a?: boolean
				b?: boolean
				foo: boolean
				one: boolean
				two: boolean
			}>()
		})
	})

	describe('AssemblyProps', () => {
		test('Combines return types of functions', () => {
			type TestFunctions = [
				() => { a: true },
				() => Promise<{ b: true }>,
				({ b }: { b: boolean }) => { c?: true },
				({ a }: { a: boolean }) => void,
				() => undefined,
				() => never,
				({ d }: { d: string }) => null,
			]
			type Result = AssemblyProps<TestFunctions>
			expectTypeOf<Result>().toEqualTypeOf<{
				a: boolean
				b: boolean
				d: string
			}>()
		})
	})

	describe('AssembledProps', () => {
		test('Combines return types of functions', () => {
			type TestFunctions = [
				() => { a: true },
				() => Promise<{ b: true }>,
				({ b }: { b: boolean }) => { c?: true },
				({ a }: { a: boolean }) => void,
				() => undefined,
				() => never,
				({ d }: { d: string }) => null,
			]
			type Result = AssembledProps<TestFunctions>
			expectTypeOf<Result>().toEqualTypeOf<{
				a: true
				b: true
				c?: true | undefined
			}>()
		})
		test('Removes undefined from initially optional attributes returned by functions', () => {
			type Props = { a?: boolean; b?: boolean }
			type AssembleA = Assembler<Props, 'a'>
			type Result = AssembledProps<[AssembleA]>

			expectTypeOf<Result>().toEqualTypeOf<{ a: boolean }>()
			expectTypeOf<Result>().not.toEqualTypeOf<{ a: boolean | undefined }>()
		})
	})
})
