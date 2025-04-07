import {
	assemble,
	assembleSync,
	type Assembler,
	type AsyncAssembler,
	type NonAssembler,
	type PartialAssembler,
} from '../src'

type NumberProps = { one?: boolean; two?: boolean }
type LetterProps = { a?: boolean; b?: boolean }

const assignOneAndTwo: Assembler<NumberProps, 'one' | 'two'> = () => {
	return { one: true, two: true }
}

const asyncAssignOne: AsyncAssembler<NumberProps, 'one'> = async () => {
	return { one: true, two: true }
}

const asyncAssignA: AsyncAssembler<LetterProps, 'a'> = async () => {
	return { a: true }
}

const assignPartialA: PartialAssembler<LetterProps & NumberProps, 'a'> = ({
	one,
}) => {
	return { a: one ? true : undefined }
}

const assignPartialB: PartialAssembler<LetterProps, 'b'> = ({ a }) => {
	if (a) return { b: true }
}

const logAssembly: NonAssembler<NumberProps & LetterProps> = (props) => {
	console.log(props)
}

const mixedAssembly = assembleSync(
	assignOneAndTwo,
	assignPartialA,
	assignPartialB,
	() => ({ foo: true }),
	logAssembly,
)
// Input Props => { a?: boolean, b?: boolean, one?: boolean, two?: boolean }
// ☝️ All the function's prop types are merged into one.

mixedAssembly({})
// Return Props => { a?: boolean, b?: boolean, foo: boolean, one: boolean, two: boolean }
// ☝️ The given assemblers provide `a`, `one`, `two` so those are no longer optional props.

// @todo Adding input props that aren't in function prop types should be a type error
mixedAssembly({ b: true, shouldError: true })
// Return Props => { a?: boolean, b: true, foo: boolean, one: boolean, two?: boolean }
// ☝️ Because `b` is given, its prop type is narrowed to a literal on the return type.

const asyncAssembly = assemble(asyncAssignOne, asyncAssignA)

const result = await asyncAssembly({})
result
// Return Props => { a: boolean, b?: boolean, one: boolean, two?: boolean }
// ☝️ The given assemblers provide `a`, `one`, `two` so those are no longer optional props.

assembleSync(
	() => ({ one: true }),
	({ one }) => ({ two: !one }),
)({})
// Return Props => { one: boolean, two: boolean }
// ☝️ The anon assemblers return `one` and `two` so they are merged into result

type InputNumberProps = { one: boolean; two?: boolean; three?: boolean }

const assembleTwo: Assembler<InputNumberProps, 'two'> = ({ one, three }) => ({
	two: three ?? one,
})
// Known props in input can be depended on by all assemble functions

const resWithInput = assembleSync(assembleTwo)({ one: true })
// Input props are required to be passed in
// Return Props => { one: boolean, two: boolean, three?: boolean }
// ☝️ The input props are merged with the result props
