import { UnionToIntersection } from 'utility-types'

/** Generic function signature, for shorthand utility types. */
export type FunctionLiteral = (...args: any) => unknown

/** Type that can a key of given type or undefined */
export type OptionalKeyOf<T> = keyof T | undefined | void

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
export type OptionalPick<T, K extends OptionalKeyOf<T> = undefined> =
  K extends keyof T ? Pick<T, K> : undefined

/**
 * Pick all required keys from given type.
 * @example
 *   type ABC = { a?: any, b: any, c: any }
 *   type RequiredKeysABC = PickRequireKeys<ABC>
 *   // ☝️ { b: any, c: any }
 */
 export type PickRequireKeys<T> = Pick<T, {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T]>

/**
 * Make all optional except given keys.
 * @example
 *   type ABC = { a: any, b: any, c: any }
 *   type OnlyAB = Only<ABC, 'a' | 'b'>
 *   // ☝️ OnlyAB = { a, b, c? }
 */
export type Only<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

/**
 * Makes given keys optional.
 * @example
 *   type ABC = { a: any, b: any, c: any }
 *   type OptionalAB = Optional<ABC, 'a' | 'b'>
 *   // ☝️ OptionalAB = { a?, b?, c }
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

 /**
 * Make given keys required.
 * @example
 *   type ABC = { a?: any, b?: any, c?: any }
 *   type IncludeAB = Include<ABC, 'a' | 'b'>
 *   // ☝️ IncludeAB = { a: any, b: any, c?: any }
 */
export type Include<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Get nested type at key.
 * @example
 *   type ABC = { a: string, b: boolean, c: number }
 *   type UnpackC = Unpack<ABC, 'c'>
 *   // ☝️ UnpackC = number
 */
export type Unpack<T, K> = K extends keyof T ? T[K] : never;

/**
 * Make a tuple from unpacked types on an interface.
 * @example
 *   type ABC = { a: string, b: boolean, c: number }
 *   type SpreadAB = Spread<ABC, ['a', 'b']>
 *   // ☝️ SpreadAB = [string, boolean]
 */
export type Spread<T, K extends Array<keyof T>> = {
  [I in keyof K]: Unpack<T, K[I]>
}

/**
 * Find one type within a union type (return `never` if not found).
 * @example
 *   type A = void | string
 *   type FindVoidA = Find<A, void>
 *   // ☝️ FindVoidA = void
 *   type B = number | string
 *   type FindVoidB = Find<B, void>
 *   // ☝️ FindVoidB = never
 */
export type Find<T, X> = T extends X ? T : never

/**
 * Get Promise resolve type.
 * @example
 *   type Response = UnwrapPromise<Promise<string>>;
 *   // ☝️ Response = string
 */
export type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Type guard for Promise type.
 * @example
 *   const logResolved = (msg: Promise<string> | string) =>
 *     isPromise(msg) ? msg.then(console.log) : console.log(msg)
 */
export function isPromise<T> (maybePromise: Promise<T> | T): maybePromise is Promise<T> {
  return (
    typeof maybePromise === "object" &&
    typeof (maybePromise as Promise<T>).then === "function"
  )
}

/**
 * Omit undefined or void types to return only defined values (or never).
 * Similar to `NonNullable<T>` but also filters on void type.
 * @example
 *   type A = Defined<{ foo: true }> // 👈 { foo: true; }
 *   type B = Defined<'foo'> // 👈 "foo"
 *   type C = Defined<true> // 👈 true
 *   type D = Defined<undefined> // 👈 never
 *   type E = Defined<null> // 👈 never
 *   type F = Defined<never> // 👈 never
 */
export type Defined<T> = [T] extends [never | void | null] ? never : undefined extends T ? never : T

/**
 * Create a union type from types in a tuple.
 * @example
 *   type TupleABC = readonly ['a', 'b', 'c']
 *   type UnionABC = TupleUnion<TupleABC>
 *   // ☝️ 'a' | 'b' | 'c'
 */
export type TupleUnion<T extends ReadonlyArray<unknown>> = T[number]

/** Cast type as object to satisfy constraints of utility types. */
export type Objectify<T> = T extends object ? T : never

export type MapReturnType<T> = {
  [K in keyof T]: T[K] extends FunctionLiteral ? ReturnType<T[K]> : T[K]
}

export type MapUnwrapPromises<T> = {
  [K in keyof T]: UnwrapPromise<T[K]>
}

export type MapDefined<T> = {
  [K in keyof T]: Defined<T[K]>
}

/**
 * Type intersection of all unconditional return types from array of functions (unwraps promises).
 * @example
 *   type TestFunctions = [
 *     () => { a: true },
 *     () => Promise<{ b: true }>,
 *     () => { c?: true },
 *     () => void,
 *     () => undefined,
 *     () => never
 *   ]
 *   type TestReturns = ReturnTypesIntersection<TestFunctions>
 *   // ☝️ { a: true } & { b: true } & { c?: true }
 */
export type ReturnTypesIntersection<Funcs extends FunctionLiteral[]> =
 UnionToIntersection<TupleUnion<MapDefined<MapUnwrapPromises<MapReturnType<Funcs>>>>>
