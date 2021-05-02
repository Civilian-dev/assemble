import {
  makePipe,
  pipe
} from './pipeType'
import { PipeFunction } from './types'

type PipeProps = { one?: boolean, two?: boolean, three?: boolean }

const assignOne: PipeFunction<PipeProps, 'one'> = () => ({ one: true })
const assignTwo: PipeFunction<PipeProps, 'two'> = () => ({ two: true })

// -------------------------------------------------------------------------------------------------

// Pipe with anonymous functions infer accumulated return types, but loses the original prop type

const anonPipe = pipe(
  assignOne,
  () => ({ foo: true })
)

anonPipe().one.valueOf
anonPipe().foo.valueOf
anonPipe().two?.valueOf // has no idea what two is

// -------------------------------------------------------------------------------------------------

// 👇 Pipes with only typed functions can infer 

const loosePipe = pipe(
  assignOne,
  assignTwo
)

// ☝️ only typed functions accepted, to allow strict props inference

loosePipe().one.valueOf
loosePipe().two.valueOf
// ☝️ `one` and `two` are not conditional because funcOne provides it

loosePipe().three.valueOf
// ☝️ `three?` is conditional, because no functions provide it

loosePipe({ three: true }).three.valueOf
// ☝️ `three` is not conditional because it is given as input

// -------------------------------------------------------------------------------------------------

const tightPipe = makePipe<PipeProps>()(
  () => ({ one: true }),
  () => ({ two: true })
)

tightPipe().one.valueOf
tightPipe().two.valueOf

const tighterPipe = makePipe<PipeProps>()(assignOne, assignTwo)

// That's pretty good!

makePipe<PipeProps>()(assignOne, assignFoo)

// Event tighter than inferred!

// -------------------------------------------------------------------------------------------------

const assignFoo: PipeFunction<{ foo: boolean }, 'foo'> = () => ({ foo: true })

/** @todo Using pipe functions operating on different prop types shouldn't work. */
const brokePipe = pipe(assignOne, assignFoo)
brokePipe().one.valueOf // 
brokePipe().foo.valueOf //
brokePipe().two.valueOf // 

// -------------------------------------------------------------------------------------------------

// const inferPipe = pipeType(...funcs)
// const typedPipe = pipeType<Props>(...funcs)
// const tuplePipe = pipeType<Props, typeof funcs>(...funcs)

// inferPipe().then((props) => props.one?.valueOf) // props are inferred from typed functions
// typedPipe().then((props) => props.one?.valueOf) // props are given and used in inline function definitions
// tuplePipe().then((props) => props.one.valueOf) // props and function types are given and output is non-conditional

// type ArrayType<T> = T extends Array<infer U> ? U : T;
