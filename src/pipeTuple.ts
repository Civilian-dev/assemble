import { AsyncPipeFunction, PipeFunction, PipeFunctions, PipeReturnType } from './types'

/**
 * Strictly typed pipes infer their return type by merging return types of all composed functions.
 * Where composed pipe functions provide a property, it is asserted to non-null on the return type.
 * However, there is some declaration overhead, requiring pipe functions to be given as a tuple.
 */
export function pipeTuple <Props> (
  fns: Readonly<PipeFunctions<Props>>
) {
  return (props: Props = {} as any) =>
    fns.reduce(async (prev: Promise<Props> | Props, fn) => {
      const acc = await prev
      const cur = await fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props) as Promise<PipeReturnType<Props, typeof fns>>
}
// as Promise<PipeReturnType<Funcs, Props>Props>



const pipeFuncs = [funcOne, funcTwo] as const


const props = pipeTuple(pipeFuncs)()

props.then(({ }) => console.log())
