import { assemble, assembleSync } from './assemble'
import { Assembler, AsyncAssembler } from './types'

interface TestProps {
  one?: boolean
  two?: boolean
  three?: boolean
}

describe('PipeType', () => {
  describe('assemble', () => {
    it('Calls all pipe functions', async () => {
      const testFn: Assembler<TestProps, void> = jest.fn()
      await assemble(testFn, testFn, testFn)({})
      expect(testFn).toBeCalledTimes(3)
    })
    it('Combines sync and async pipe function outputs', async () => {
      const testAsync: AsyncAssembler<TestProps, 'one'> = async () =>
        ({ one: await Promise.resolve(true) })
      const testSync: Assembler<TestProps, 'two'> = () =>
        ({ two: true })
      await expect(
        assemble(testAsync, testSync)({ })
      ).resolves.toEqual({ one: true, two: true })
    })
    it('Accepts anonymous functions', () => {
      expect(
        assemble(
          () => ({ one: true }),
          ({ one }) => ({ two: !one })
        )({})
      ).resolves.toEqual({ one: true, two: false })
    })
  })
  describe('assembleSync', () => {
    it('Combines all pipe function outputs', () => {
      const testAsync: Assembler<TestProps, 'one'> = () =>
      ({ one: true })
      const testSync: Assembler<TestProps, 'two'> = () =>
        ({ two: true })
      expect(
        assembleSync(testAsync, testSync)({})
      ).toEqual({ one: true, two: true })
    })
  })
})
