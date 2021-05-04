import test from '../testType'
import { OptionalPick } from '../../src/util'

type AB = { a: any, b: any }

// @dts-jest:group OptionalPick
{
  // @dts-jest:snap a==a
  test<OptionalPick<AB, 'a'>>()

  // @dts-jest:snap ab==ab
  test<OptionalPick<AB, 'a' | 'b'>>()

  // @dts-jest:snap b?==b?
  test<OptionalPick<AB, 'b' | undefined>>()

  // @dts-jest:snap undefined=undefined
  test<OptionalPick<AB, undefined>>()
  
  // @dts-jest:snap not-defined=void
  test<OptionalPick<AB>>()
}
