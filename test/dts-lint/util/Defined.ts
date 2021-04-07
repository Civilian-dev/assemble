import { Defined } from '../../../src/types/util'

// $ExpectType object
type _DefinedObject = Defined<{ foo: true }>

// $ExpectType string
type _DefinedString = Defined<'foo'>

// $ExpectType boolean
type _DefinedBoolean = Defined<true>

// $ExpectType never
type _DefinedNull = Defined<null>

// $ExpectType never
type _DefinedUndefined = Defined<undefined>

// $ExpectType never
type _DefinedNever = Defined<never>
