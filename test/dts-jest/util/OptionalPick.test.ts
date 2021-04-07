import test from '../../testType'
import { OptionalPick } from '../../../src/types/util'

type AB = { a: any, b: any }

// @dts-jest:group OptionalPick
{
  // @dts-jest:snap a==a
  test<OptionalPick<AB, 'a'>>()

  // @dts-jest:snap ab==ab
  test<OptionalPick<AB, 'a' | 'b'>>()

  // @dts-jest:snap b?==b?
  test<OptionalPick<AB, 'b' | undefined>>()

  // @dts-jest:snap undefined==undefined
  test<OptionalPick<AB>>()
  
  // @dts-jest -> undefined
  test<OptionalPick<AB>>()
}
