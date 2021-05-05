import test from '../testType'
import { AssembledProps, AssemblyProps } from '../../src/types'
import { UnknownFunction } from '../../src/util'

type TestFunctions = [
  () => { a: true },
  () => Promise<{ b: true }>,
  ({ b }: { b: boolean }) => { c?: true },
  ({ a }: { a: boolean }) => void,
  () => undefined,
  () => never,
  ({ d }: { d: string }) => null
]

// @dts-jest:group AssemblyProps
{
  // @dts-jest:snap 💁 { b: boolean, a: boolean, d: string } -> { b: boolean; a: boolean; d: string; }
  test<AssemblyProps<TestFunctions>>()
}

// @dts-jest:group AssembledProps
{
  // @dts-jest:snap 💁 { a: true, b: true, c?: true | undefined } -> { a: true; b: true; c?: true | undefined; }
  test<AssembledProps<TestFunctions>>()
}
