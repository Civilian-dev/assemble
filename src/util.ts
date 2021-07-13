/** Generic function signature for utility type constraints. */
export type UnknownFunction = (...args: never) => unknown

/** Generic object signature for utility type constraints. */
export type UnknownObject = Record<string, unknown>

/** Assign properties of types in union type to one type. */
export type MergeUnion<U> =
  (U extends unknown ? (k: U) => void: never) extends
  (k: infer I) => void ? { [P in keyof I]: I[P] } : never

/** Get a union of types in array. */
export type ArrayUnion<T extends ReadonlyArray<unknown>> = T[number]

/** Assign return types at key of functions. */
export type MapReturnType<T> = {
  [K in keyof T]: T[K] extends UnknownFunction ? ReturnType<T[K]> : T[K]
}

/** Get resolve type of promise. */
export type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;

/** Get resolve types at key of promises. */
export type MapUnwrapPromises<T> = {
  [K in keyof T]: UnwrapPromise<T[K]>
}

/** Remove non object value types from all indexes. */
export type FilterObjects<T> = {
  [K in keyof T]: T[K] extends UnknownObject ? T[K] : never
}

/** Make all props not optional without removing undefined from value types. */
export type NonPartial<T> = { [K in keyof Required<T>]: T[K] };
