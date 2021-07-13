import test from '../testType'
import { NonPartial } from '../../src/util'

type TestProps = {
  foo?: string | undefined
}

// @dts-jest:group NonPartial
{
  // @dts-jest:snap 💁 { foo: string | undefined } -> NonPartial<TestProps>
  test<NonPartial<TestProps>>()
}
