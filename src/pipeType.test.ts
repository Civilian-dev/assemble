import { pipeType, pipeTypeSync } from './pipeType'
import { PipeFunction, AsyncPipeFunction } from './types'

interface TestProps {
  one?: boolean
  two?: boolean
  three?: boolean
}

describe('PipeType', () => {
  describe('pipeType', () => {
    it('Calls all pipe functions', async () => {
      const testFn: PipeFunction<TestProps, void> = jest.fn()
      await pipeType(testFn, testFn, testFn)({})
      expect(testFn).toBeCalledTimes(3)
    })
    it('Combines sync and async pipe function outputs', async () => {
      const testAsync: AsyncPipeFunction<TestProps, 'one'> = async () =>
        ({ one: await Promise.resolve(true) })
      const testSync: PipeFunction<TestProps, 'two'> = () =>
        ({ two: true })
      await expect(
        pipeType(testAsync, testSync)({ })
      ).resolves.toEqual({ one: true, two: true })
    })
    it('Accepts anonymous function types using interface', () => {
      expect(
        pipeType<TestProps>(
          () => ({ one: true }),
          ({ one }) => ({ two: !one })
        )({})
      ).resolves.toEqual({ one: true, two: false })
    })
  })
  describe('pipeTypeSync', () => {
    it('Combines all pipe function outputs', () => {
      const testAsync: PipeFunction<TestProps, 'one'> = () =>
      ({ one: true })
      const testSync: PipeFunction<TestProps, 'two'> = () =>
        ({ two: true })
      expect(
        pipeTypeSync(testAsync, testSync)({})
      ).toEqual({ one: true, two: true })
    })
  })
})
