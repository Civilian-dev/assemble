import test from '../testType'
import { MergeUnion } from '../../src/util'

// @dts-jest:group MergeUnion
{
  // @dts-jest:snap {foo}|{bar}=={foo,bar} -> { foo: true; bar: true; }
  test<MergeUnion<{ foo: true } | { bar: true }>>()
}
