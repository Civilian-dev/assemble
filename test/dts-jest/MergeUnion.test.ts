import test from '../testType'
import { MergeUnion } from '../../src/util'

// @dts-jest:group MergeUnion
{
  // @dts-jest:snap {foo}|{bar}=={foo,bar}
  test<MergeUnion<{ foo: true } | { bar: true }>>()
}
