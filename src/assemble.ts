import type {
  AssembledProps,
  AssemblyProps,
  MixedAssemblers,
  SyncAssemblers
} from './types/assembler'
import type { MergeUnion } from './types/util'

/**
 * Apply a series of (potentially async) functions to an interface.
 * Resolves with intersection of input and all unconditional function returns.
 */
export function assemble<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Funcs extends MixedAssemblers<any>,
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
      if (typeof cur === 'object') {
        Object.assign(acc, cur)
      }
      return acc
    }, props) as unknown as Returned
}

/**
 * Compose an array of functions to operate on an interface.
 * Returns intersection of input and all unconditional function returns.
 */
export function assembleSync<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Funcs extends SyncAssemblers<any>,
  Props extends AssemblyProps<Funcs>,
  Assigned extends AssembledProps<Funcs>
> (...funcs: Funcs) {
  return <
    Input extends Readonly<Props>,
    Returned extends MergeUnion<Props & Input & Assigned>
  > (props: Input) =>
    funcs.reduce((acc: Props, fn) => {
      const cur = fn(acc)
      if (typeof cur === 'object') {
        Object.assign(acc, cur)
      }
      return acc
    }, props) as unknown as Returned
}

/**
 * @todo Find a solution that doesn't require overriding Returned types.
 * Return types are forced by `as unknown as Returned` to avoid errors because `Returned` could be
 * instantiated with a different subtype of the MergeUnion constraint. This seems unavoidable to
 * create the union of assigned props from different functions, with those function's input types.
*/
