# Assemble

A small but powerful functional programming utility for type-safe pipe-like operations.

---

Assemble composes arrays of functions that pick from and assign to a given type (assembling it).
The composed "assembly" is like a pipe that steps through each function merging any returned props
with input and passing it to the next. It returns a promise that resolves with the assembled result.
Common use cases would be applying a sequence of functions to app state, DB or API results.

While there are functional programming utilities with more features and advanced concepts, Assemble
encourages an approach to composition that is versatile yet simple to reason about and is type-safe
with minimal definition overhead.

The `Assembler` utility creates a definition for a function that can be given to `assemble`. It
declares the props type the function will operate on and can optionally define which props it will
return (it can also return void or conditionally undefined).

Examples of generated function definitions where `type Props = { message?: string, name?: string }`:

`Assembler<Props, 'message'>`
➥ `(props: Props) => { message: string }`

`Assembler<Props, 'message' | undefined>`
➥ `(props: Props) => { message?: string }`

`Assembler<Props, 'name' | 'message'>`
➥ `(props: Props) => { message: string, name: string }`

`Assembler<Props, void>`
➥ `(props: Props) => void`

---

### Hello World

This sample shows two assemblers operating on `Props`. These functions benefit from type hinting for
the arguments they can take from props and if defined, the props they need to return.

```ts
import { assemble, Assembler } from '@os-gurus/assemble'

interface Props {
  name: string
  message?: string
}

const prepareMessage: Assembler<Props, 'message'> = ({ name }) => {
  return { message: `Hello ${name}` }
}

const logMessage: Assembler<Props> = ({ message }) => {
  console.log(message)
}

const sayHello = assemble(prepareMessage, logMessage)

sayHello({ name: 'World' })
// 🖨️ "Hello World"
```

---

### Async Assemblers

Use `AsyncAssembler` utility works exactly as `Assembler` for asynchronous functions and
`assemble` can compose a mixture of async and sync assemblers.

`assembleSync` can be used to enforce synchronous functions and a non-promise return.

```ts
import fetch from 'node-fetch'
import { assemble, Assembler, AsyncAssembler } from '@os-gurus/assemble'

interface Props {
  name?: string
  message?: string
}

const fetchName: AsyncAssembler<Props, 'name'> = async () => {
  const { results } = await fetch('https://randomuser.me/api')
  return { name: results[].name.first }
}

const prepareMessage: Assembler<Props, 'message'> = ({ name }) => {
  return { message: `Hello ${name}` }
}

const logMessage: Assembler<Props, void> = ({ message }) => {
  console.log(message)
}

const sayHello = assemble(fetchName, prepareMessage, logMessage)

sayHello()
// 🖨️  "Hello Random"
```

### Strict Return Types

By default `assemble` return type is just the pipe interface in a promise. It is possible to define
a more strict return type ensuring there's no conditional properties where pipe functions explicitly
return those props. However, there is some declaration overhead...

```ts
import { pipeTypeStrict, Assembler } from '@os-gurus/pipe-type'

interface ICount {
  one?: boolean
  two?: boolean
  three?: boolean
}

const countToOne: Assembler<PipeProps, 'one'> = () => ({ one: true })
const countToTwo: Assembler<PipeProps, 'two'> = () => ({ two: true })

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
case it might be better to use the standard `assemble` and protect against conditional attributes.
