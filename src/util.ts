/** Generic function signature for utility type constraints. */
export type UnknownFunction = (...args: never) => unknown

/** Generic object signature for utility type constraints. */
export type UnknownObject = Record<string, unknown>

/** Type that can a key of given type or undefined. */
export type OptionalKeyOf<T> = keyof T | undefined | void

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

/**
 * Union of picked properties by key/s where key can be omitted and type will be undefined.
 * @example
 *   type AB = { a: any, b: any }
 *   type PickA = OptionalPick<AB, 'a'> // 👈 { a: any }
 *   type PickB = OptionalPick<AB, 'b'> // 👈 { b: any }
 *   type PickMaybeB = OptionalPick<AB, 'b' | undefined> // 👈 { b: any } | undefined
 *   type PickAB = OptionalPick<AB, 'a' | 'b'> // 👈 { a: any, b: any }
 *   type PickNone = OptionalPick<AB> // 👈 undefined
 * @todo Cannot yet do partial undefined, e.g:
 *   OptionalPick<AB, ['a' | undefined, 'b']>
 *   // ☝️ { a: any, b?: any }
 */
export type OptionalPick<T, K extends OptionalKeyOf<T>> =
  K extends keyof T ? Pick<T, K> : K extends void ? void : undefined
