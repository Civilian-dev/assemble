import test from '../testType'
import { Defined } from '../../src/util'

// @dts-jest:group Defined
{
  // @dts-jest:snap object==object -> { foo: true; }
  test<Defined<{ foo: true }>>()

  // @dts-jest:snap string==string -> "foo"
  test<Defined<'foo'>>()

  // @dts-jest:snap boolean==boolean -> true
  test<Defined<true>>()

  // @dts-jest:snap undefined==never -> never
  test<Defined<undefined>>()

  // @dts-jest:snap null==never -> never
  test<Defined<null>>()

  // @dts-jest:snap never==never -> never
  test<Defined<never>>()
}
