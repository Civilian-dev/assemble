import { assembleSync, Assembler } from '../'
import { AssemblyProps, AssembledProps } from '../types'

type Props = { one?: boolean, two?: boolean, three?: boolean }

const assignOne: Assembler<Props, 'one'> = () => ({ one: true })

const testFunctions = [
  assignOne,
  () => ({ foo: true })
]

const testAssembly = assembleSync(...testFunctions)

type TestAssemblyProps = AssemblyProps<typeof testFunctions>
type TestAssembledProps = AssembledProps<typeof testFunctions>

testAssembly({}).one.valueOf // should be non-null
testAssembly({}).two?.valueOf // should be nullable
testAssembly({}).foo.valueOf // should be defined
testAssembly({ three: true }).three.valueOf // should be defined and non-null

function testInput<
  Props extends AssemblyProps<typeof testFunctions>,
  Input extends Props
>(input: Input) {
  return input as Input & Props
}

testInput({}).one.valueOf // should be defined
