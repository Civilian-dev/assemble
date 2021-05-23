import { assembleSync, Assembler, PartialAssembler, VoidAssembler } from '../'

type NumberProps = { one?: boolean, two?: boolean }
type LetterProps = { a?: boolean, b?: boolean }

const assignOneAndTwo: Assembler<NumberProps, 'one' | 'two'> =
  () => {
    return { one: true, two: true }
  }

const assignPartialA: PartialAssembler<LetterProps & NumberProps, 'a'> =
  ({ one }) => {
    return { a: one ? true : undefined }
  }

const assignPartialB: PartialAssembler<LetterProps, 'b'> =
  ({ a }) => {
    if (a) return { b: true }
  }

const logAssembly: VoidAssembler<NumberProps & LetterProps> =
  (props) => {
    console.log(props)
  }

const mixedAssembly = assembleSync(
  assignOneAndTwo,
  assignPartialA,
  assignPartialB,
  () => ({ foo: true }),
  logAssembly
)
// Input Props => { a?: boolean, b?: boolean, one?: boolean, two?: boolean }
// ☝️ All the function's prop types are merged into one.

mixedAssembly({})
// Return Props => { a?: boolean, b?: boolean, foo: boolean, one: boolean, two: boolean }
// ☝️ The given assemblers provide `a`, `one`, `two` so those are no longer optional props.

// @todo Adding input props that aren't in function prop types should be a type error
mixedAssembly({ b: true, shouldError: true })
// Return Props => { a: boolean, b: true, foo: boolean, one: boolean, two?: boolean }
// ☝️ Because `b` is given, its prop type is narrowed to a literal on the return type.
