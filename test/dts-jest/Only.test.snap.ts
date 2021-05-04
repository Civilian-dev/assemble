import test from '../testType'
import { Only } from '../../src/util'

type ABC = { a: any, b: any, c: any }

// @dts-jest:group Only
{
  // @dts-jest:snap a,b==a,b,c? -> Only<ABC, "a" | "b">
  test<Only<ABC, 'a' | 'b'>>()
}
