import { assembleSync, Assembler } from '../'

type NumberProps = { one?: boolean, two?: boolean }
type LetterProps = { a?: boolean, b?: boolean }

const assignOneAndTwo: Assembler<NumberProps, 'one' | 'two'> = () => ({ one: true })
const assignA: Assembler<LetterProps, 'a'> = () => ({ a: true })

const mixedAssembly = assembleSync(
  assignOneAndTwo,
  assignA,
  () => ({ foo: true })
)
// Input Props => { a?: boolean, b?: boolean, one?: boolean, two?: boolean }
// ☝️ All the function's prop types are merged into one.

mixedAssembly({})
// Return Props => { a: boolean, b?: boolean, foo: boolean, one: boolean, two: boolean }
// ☝️ The given assemblers provide `a`, `one`, `two` so those are no longer optional props.

mixedAssembly({ b: true })
// Return Props => { a: boolean, b: true, foo: boolean, one: boolean, two?: boolean }
// ☝️ Because `b` is given, its prop type is narrowed to a literal on the return type.
