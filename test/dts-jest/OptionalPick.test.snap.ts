import test from '../testType'
import { OptionalPick } from '../../src/util'

type AB = { a: any, b: any }

// @dts-jest:group OptionalPick
{
  // @dts-jest:snap a==a -> Pick<AB, "a">
  test<OptionalPick<AB, 'a'>>()

  // @dts-jest:snap ab==ab -> Pick<AB, "a"> | Pick<AB, "b">
  test<OptionalPick<AB, 'a' | 'b'>>()

  // @dts-jest:snap b?==b? -> void | Pick<AB, "b">
  test<OptionalPick<AB, 'b' | undefined>>()

  // @dts-jest:snap undefined=undefined -> void
  test<OptionalPick<AB, undefined>>()
  
  // @dts-jest:snap not-defined=void -> Generic type 'OptionalPick' requires 2 type argument(s).
  test<OptionalPick<AB>>()
}
