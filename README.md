# PipeType

A small but powerful functional programming utility for type-safe pipes.

---

Use `pipeType` to compose arrays of typed functions that pick from and assign to a common interface.

For example, to apply a series of processes to application state, user input, DB or API results.

It will execute each function and pass the result to the next, merged with the original input.
It returns a promise that resolves with the combined results, ignoring undefined or void returns. 

Also exported are a suite of utilities to define function, input and output types.

---

### Hello World

This sample shows two anonymous functions operating on `PipeProps`. They are each typed from the
inferred definition provided by `pipeType` and benefit from code hinting for the properties they
can access and return.

```ts
import { pipeType } from '@os-gurus/pipe-type'

interface PipeProps {
  name: string
  message?: string
}

const sayHello = pipeType<PipeProps>(
  ({ name }) => ({ message: `Hello ${name}` }),
  ({ message }) => console.log(message)
)

sayHello({ name: 'World' })
// 🖨️ "Hello World"
```

---

### Pipe Functions

The `PipeFunction` utility generates a function type that operates on the pipe interface.

The generated function type will take the interface as an argument and usually return one or more of
its properties to mutate/assign. It can also be defined to return void or conditionally undefined.

Examples of generated function definitions:
- `PipeFunction<PipeProps, 'message'>` ➡ <br/>
  `(props: PipeProps) => { message: string }`
- `PipeFunction<PipeProps, 'message' | undefined>` ➡ <br/>
  `(props: PipeProps) => { message?: string }`
- `PipeFunction<PipeProps, 'name' | 'message'>` ➡ <br/>
  `(props: PipeProps) => { message: string, name: string }`
- `PipeFunction<PipeProps, void>` ➡ <br/>
  `(props: PipeProps) => void`

Here's a version of the first example with functions that can be exported and tested in isolation.

```ts
import { pipeType, PipeFunction } from '@os-gurus/pipe-type'

interface PipeProps {
  name: string
  message?: string
}

const prepareMessage: PipeFunction<PipeProps, 'message'> = ({ name }) => {
  return { message: `Hello ${name}` }
}

const logMessage: PipeFunction<PipeProps, void> = ({ message }) => {
  console.log(message)
}

const sayHello = pipeType(prepareMessage, logMessage)

sayHello({ name: 'World' })
// 🖨️ "Hello World"
```

### Async Pipes

Use `AsyncPipeFunction` utility works exactly as `PipeFunction` for asynchronous functions and
`pipeType` can compose a combination of async/sync functions.

`pipeTypeSync` can be used to enforce synchronous functions and a non-promise return.

```ts
import fetch from 'node-fetch'
import { pipeType, PipeFunction, AsyncPipeFunction } from '@nested-code/pipe-type'

interface PipeProps {
  name?: string
  message?: string
}

const fetchName: AsyncPipeFunction<PipeProps, 'name'> = async () => {
  const { results } = await fetch('https://randomuser.me/api')
  return { name: results[].name.first }
}

const prepareMessage: PipeFunction<PipeProps, 'message'> = ({ name }) => {
  return { message: `Hello ${name}` }
}

const logMessage: PipeFunction<PipeProps, void> = ({ message }) => {
  console.log(message)
}

const sayHello = pipeType(fetchName, prepareMessage, logMessage)

sayHello()
// 🖨️  "Hello Random"
```

### Strict Return Types

By default `pipeType` return type is just the pipe interface in a promise. It is possible to define
a more strict return type ensuring there's no conditional properties where pipe functions explicitly
return those props. However, there is some declaration overhead...

```ts
import { pipeTypeStrict, PipeFunction } from '@os-gurus/pipe-type'

interface ICount {
  one?: boolean
  two?: boolean
  three?: boolean
}

const countToOne: PipeFunction<PipeProps, 'one'> = () => ({ one: true })
const countToTwo: PipeFunction<PipeProps, 'two'> = () => ({ two: true })

const countFns = [countToOne, countToTwo] as const

/** @todo which approach? */
const count = pipeTuple<PipeProps>(countFns)
const count = pipeTuple<PipeProps, typeof countFns>(countFns)

const counted = count()

console.log(typeof counted)
// 🖨️ Promise<{ one: boolean, two: boolean, three?: boolean }>
// ☝️ notice required vs optional props
```

This is useful when pipes are nested within methods which need to provide definitive return types.
However, one of the benefits of functional programming is to allow for composed functions to be
independent of each other, so it's not always appropriate to assume they will all apply. In that
case it might be better to use the standard `pipeType` and protect against conditional attributes.
