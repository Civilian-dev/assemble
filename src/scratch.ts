import {
  pipeTypeInlineSync,
  pipeTypeSync
} from './pipeType'
import { PipeFunction } from './types'

interface Props { one?: boolean, two?: boolean, three?: boolean}
const funcOne: PipeFunction<Props, 'one'> = () => ({ one: true })
const funcTwo: PipeFunction<Props, 'two'> = ({ one }) => ({ two: !!one })

const inferPipeSync = pipeTypeSync(funcOne, funcTwo)

const inlinePipeSync = pipeTypeInlineSync<Props>(
  () => ({ two: true }),
  funcTwo,
  () => ({ three: true })
)

inferPipeSync().two.valueOf
inlinePipeSync().two?.valueOf

// -------------------------------------------------------------------------------------------------

// const inferPipe = pipeType(...funcs)
// const typedPipe = pipeType<Props>(...funcs)
// const tuplePipe = pipeType<Props, typeof funcs>(...funcs)

// inferPipe().then((props) => props.one?.valueOf) // props are inferred from typed functions
// typedPipe().then((props) => props.one?.valueOf) // props are given and used in inline function definitions
// tuplePipe().then((props) => props.one.valueOf) // props and function types are given and output is non-conditional

// type ArrayType<T> = T extends Array<infer U> ? U : T;
