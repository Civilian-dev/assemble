import { MergeUnion } from './util'
import { MixedAssemblers, SyncAssemblers, AssembledProps, AssemblyProps } from './types'

/**
 * Apply a series of (potentially async) functions to an interface.
 * Resolves with intersection of input and all unconditional function returns.
 */
export function assemble<
  Funcs extends MixedAssemblers<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  Props extends AssemblyProps<Funcs>,
  Assigned extends AssembledProps<Funcs>
> (...funcs: Funcs) {
  return <
    Input extends Props,
    Returned extends Promise<MergeUnion<Props & Input & Assigned>>
  > (props: Input) =>
    funcs.reduce(async (prev: Promise<Props> | Props, fn) => {
      const acc = await prev
      const cur = await fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props) as unknown as Returned
}

/**
 * Compose an array of functions to operate on an interface.
 * Returns intersection of input and all unconditional function returns.
 */
export function assembleSync<
  Funcs extends SyncAssemblers<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  Props extends AssemblyProps<Funcs>,
  Assigned extends AssembledProps<Funcs>
> (...funcs: Funcs) {
  return <
    Input extends Props,
    Returned extends MergeUnion<Props & Input & Assigned>
  > (props: Input) =>
    funcs.reduce((acc: Props, fn) => {
      const cur = fn(acc)
      return (typeof cur === 'object')
        ? { ...acc, ...cur }
        : acc
    }, props) as unknown as Returned
}

/**
 * @todo Find a solution that doesn't require overriding Returned types.
 * Return types are forced by `as unknown as Returned` to avoid errors because `Returned` could be
 * instantiated with a different subtype of the MergeUnion constraint. This seems unavoidable to
 * create the union of assigned props from different functions, with those function's input types.
*/
