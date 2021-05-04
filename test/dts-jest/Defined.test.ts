import test from '../testType'
import { Defined } from '../../src/util'

// @dts-jest:group Defined
{
  // @dts-jest:snap object==object
  test<Defined<{ foo: true }>>()

  // @dts-jest:snap string==string
  test<Defined<'foo'>>()

  // @dts-jest:snap boolean==boolean
  test<Defined<true>>()

  // @dts-jest:snap undefined==never
  test<Defined<undefined>>()

  // @dts-jest:snap null==never
  test<Defined<null>>()

  // @dts-jest:snap never==never
  test<Defined<never>>()
}
