import { assemble, assembleSync } from './assemble'
import { Assembler, AsyncAssembler, VoidAssembler } from './types'

interface TestProps {
  one?: boolean
  two?: boolean
  three?: boolean,
  maybe?: boolean | undefined
}

describe('PipeType', () => {
  describe('assemble', () => {
    it('Calls all assemblers', async () => {
      const testFn: VoidAssembler<TestProps> = jest.fn()
      await assemble(testFn, testFn, testFn)({})
      expect(testFn).toBeCalledTimes(3)
    })
    it('Combines sync and async assemblers returns', async () => {
      const testAsync: AsyncAssembler<TestProps, 'one'> = async () => ({
        one: await Promise.resolve(true)
      })
      const testSync: Assembler<TestProps, 'two'> = () => ({
        two: true
      })
      await expect(assemble(testAsync, testSync)({}))
        .resolves.toEqual({ one: true, two: true })
    })
    it('Processes undefined props', async () => {
      const testMaybe: Assembler<TestProps, 'maybe'> = () => ({
        maybe: undefined
      })
      await expect(assemble(testMaybe)({}))
        .resolves.toEqual({ maybe: undefined })
    })
    it('Accepts anonymous functions', async () => {
      await expect(assemble(
        () => ({ one: true }),
        ({ one }) => ({ two: !one })
      )({})).resolves.toEqual({ one: true, two: false })
    })
  })
  describe('assembleSync', () => {
    it('Combines all assembler returns', () => {
      const testAsync: Assembler<TestProps, 'one'> = () =>
        ({ one: true })
      const testSync: Assembler<TestProps, 'two'> = () =>
        ({ two: true })
      expect(assembleSync(testAsync, testSync)({}))
        .toEqual({ one: true, two: true })
    })
  })
})
