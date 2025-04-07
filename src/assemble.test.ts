import { describe, expect, test, vitest } from 'vitest'
import { assemble, assembleSync } from './assemble'
import type {
	Assembler,
	AsyncAssembler,
	NonAssembler,
	PartialAssembler,
} from './types/assembler'

type TestProps = {
	one?: boolean
	two?: boolean
	three?: boolean
	maybe?: boolean | undefined
}

describe('Assemble', () => {
	describe('assemble', () => {
		test('Calls all assemblers', async () => {
			const testFn: NonAssembler<TestProps> = vitest.fn()
			await assemble(testFn, testFn, testFn)({})
			expect(testFn).toBeCalledTimes(3)
		})
		test('Combines sync and async assemblers returns', async () => {
			const testAsync: AsyncAssembler<TestProps, 'one'> = async () => ({
				one: await Promise.resolve(true),
			})
			const testSync: Assembler<TestProps, 'two'> = () => ({
				two: true,
			})
			await expect(assemble(testAsync, testSync)({})).resolves.toEqual({
				one: true,
				two: true,
			})
		})
		test('Processes partially assembled or undefined props', async () => {
			const getMaybe: Assembler<TestProps, 'maybe'> = () => ({
				maybe: undefined,
			})
			const getTwoIfOne: PartialAssembler<TestProps, 'two'> = ({ one }) =>
				one ? { two: true } : undefined
			await expect(assemble(getMaybe, getTwoIfOne)({})).resolves.toEqual({
				maybe: undefined,
			})
		})
		test('Accepts anonymous functions', async () => {
			await expect(
				assemble(
					() => ({ one: true }),
					({ one }) => ({ two: !one }),
				)({}),
			).resolves.toEqual({ one: true, two: false })
		})
	})
	describe('assembleSync', () => {
		test('Combines all assembler returns', () => {
			const testAsync: Assembler<TestProps, 'one'> = () => ({ one: true })
			const testSync: Assembler<TestProps, 'two'> = () => ({ two: true })
			expect(assembleSync(testAsync, testSync)({})).toEqual({
				one: true,
				two: true,
			})
		})
	})
})
