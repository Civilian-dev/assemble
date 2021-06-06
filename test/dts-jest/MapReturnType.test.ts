import test from '../testType'
import { MapReturnType } from '../../src/util'

// @dts-jest:group MapReturnType
{
  // @dts-jest:snap [()=>bool,()=>void,()=>string]==[bool,void,string]
  test<MapReturnType<[() => boolean, () => void, () => string]>>()
}
