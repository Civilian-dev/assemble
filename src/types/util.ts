/** Generic function signature for utility type constraints. */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type UnknownFunction = (...args: any[]) => unknown

/** Generic object signature for utility type constraints. */
export type UnknownObject = { [key: string]: unknown }

/** Assign properties of types in union type to one type. */
export type MergeUnion<U> = (
	U extends unknown
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? { [P in keyof I]: I[P] }
	: never

/** Get a union of types in array. */
export type ArrayUnion<T extends ReadonlyArray<unknown>> = T[number]

/** Assign return types at key of functions. */
export type MapReturnType<T> = {
	[K in keyof T]: T[K] extends UnknownFunction ? ReturnType<T[K]> : T[K]
}

/** Get resolve type of promise. */
export type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T

/** Get resolve types at key of promises. */
export type MapUnwrapPromises<T> = {
	[K in keyof T]: UnwrapPromise<T[K]>
}

/**
 * Remove non object value types from all indexes.
 * @todo This returns like { a: object, b: never } instead of { a: object }
 * 			 The commented code fixes this but causes type errors elsewhere.
 *       Unsure if this should be changed or maybe just adjust semantics of the type name.
 */
export type FilterObjects<T> = {
	// [K in keyof T as T[K] extends UnknownObject ? K : never]: T[K]
	[K in keyof T]: T[K] extends UnknownObject ? T[K] : never
}

/** @todo I don't think NonPartial is doing anything more than Required, maybe remove it? */

/**
 * Make all props not optional without removing undefined from value types.
 * @todo Could not maintain explicit undefined in union types because it gets added to all optional
 * props, even when "required" as [P in keyof T]-?: T[P]
 * @see exactOptionalPropertyTypes (close to what we want, but didn't work)
 */
export type NonPartial<T> = Required<T>
// export type NonPartial<T> = { [K in keyof T]-?: T[K] }

/** Make all props not optional and remove undefined from value types. */
// export type NonPartial<T> = { [K in keyof T]-?: Exclude<T[K], undefined> }
