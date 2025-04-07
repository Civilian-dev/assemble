import { describe, expectTypeOf, test } from 'vitest'
import type {
	ArrayUnion,
	FilterObjects,
	MapReturnType,
	MapUnwrapPromises,
	MergeUnion,
	NonPartial,
	UnwrapPromise,
} from './util'

describe('Util Types', () => {
	describe('MergeUnion', () => {
		test('Merges union of objects into one object', () => {
			type Result = MergeUnion<{ foo: true } | { bar: true }>
			expectTypeOf<Result>().toEqualTypeOf<{ foo: true; bar: true }>()
		})
	})

	describe('ArrayUnion', () => {
		test('Gets union of types in array', () => {
			type Arr = [string, number, boolean]
			type Result = ArrayUnion<Arr>
			expectTypeOf<Result>().toEqualTypeOf<string | number | boolean>()
		})
	})

	describe('MapReturnType', () => {
		test('Maps return types of functions', () => {
			type Funcs = [() => boolean, () => void, () => string]
			type Result = MapReturnType<Funcs>
			expectTypeOf<Result>()
				// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
				.toEqualTypeOf<[boolean, void, string]>()
		})
	})

	describe('UnwrapPromise', () => {
		test('Unwraps promise types', () => {
			type Result = UnwrapPromise<Promise<boolean>>
			expectTypeOf<Result>().toEqualTypeOf<boolean>()
		})
	})

	describe('MapUnwrapPromises', () => {
		test('Maps unwrapped promise types', () => {
			type Promises = { a: Promise<boolean>; b: Promise<string> }
			type Result = MapUnwrapPromises<Promises>
			expectTypeOf<Result>().toEqualTypeOf<{ a: boolean; b: string }>()
		})
	})

	describe('FilterObjects', () => {
		test('Filters out non-object types', () => {
			type Mixed = {
				a: boolean
				b: number
				c: string
				d: Record<string, unknown>
			}
			type Result = FilterObjects<Mixed>
			// expectTypeOf<Result>().toEqualTypeOf<{ d: Record<string, unknown> }>() /** @see @todo */
			expectTypeOf<Result>().toEqualTypeOf<{
				a: never
				b: never
				c: never
				d: Record<string, unknown>
			}>()
		})
	})

	describe('NonPartial', () => {
		test('Removes optional properties from type', () => {
			type Props = { a?: boolean; b: boolean }
			type Result = NonPartial<Props>
			expectTypeOf<Result>().toEqualTypeOf<{ a: boolean; b: boolean }>()
		})
		test('Maintains undefined on union types', () => {
			type Props = {
				a?: boolean
				b: boolean | undefined
				c?: boolean | undefined
			}
			type Result = NonPartial<Props>
			expectTypeOf<Result>().toEqualTypeOf<{
				a: boolean
				b: boolean | undefined
				c: boolean | undefined
			}>()
		})
	})
})
