import {
  FunctionLiteral,
  Defined,
  UnwrapPromise
} from './util'

// These just apply other utilities to a type's properties

/** @todo Why does it need a FunctionLiteral constraint - should infer from ReturnType args */
export type MapReturnType<T> = {
  [K in keyof T]: T[K] extends FunctionLiteral ? ReturnType<T[K]> : never
}

export type MapUnwrapPromises<T> = {
  [K in keyof T]: UnwrapPromise<T[K]>
}

export type MapDefined<T> = {
  [K in keyof T]: Defined<T[K]>
}
