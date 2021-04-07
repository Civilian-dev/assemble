import { pipeTuple } from './pipeTuple'

it('Can infer return types from composed tuples', async () => {
  type PipeProps = {
    one?: boolean
    two?: boolean
    three?: boolean
  }
  type ExpectProps = {
    one: boolean
    two: boolean
  }
  const testOne: PipeFunction<PipeProps, 'one'> = () => ({ one: true })
  const testTwo: PipeFunction<PipeProps, 'two'> = () => ({ two: true })
  const testFuncs = [testOne, testTwo] as const
  const testPipe: PipeType<PipeProps, typeof testFuncs> = pipeType(...testFuncs)
  const testResult = await testPipe({})
  const testAssertion: ExpectProps = { one: true, two: true }
  testResult // ?
  testAssertion // ?
  /** @todo Don't know how to test this, but testResult should have the type of testAssertion */
})

const countToOne: PipeFunctionStrict<TestProps, 'one'> = () => ({ one: true })
const countToTwo: PipeFunctionStrict<TestProps, 'two'> = () => ({ two: true })
const countFns = [countToOne, countToTwo] as const

const countPipeConst: PipeType<TestProps, typeof countFns> = pipeTuple(countFns)({})

const count = countPipeConst(countToOne, countToTwo)

const countedLoose = count({})
// 🪄 type detection = { one?: boolean, two?: boolean, three?: boolean }

const countedStrict = countPipeConst({})
// 🪄 type detection = { one: boolean, two: boolean }

/** @todo merge input type and output type, to get all props */
const countedStrictBetter = countPipeConst({ three: true })
// 🪄 type detection = { one: boolean, two: boolean, three: boolean }
