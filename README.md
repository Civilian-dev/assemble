# Assemble

A small but powerful functional programming utility for type-safe pipe-like operations.

---

Assemble composes arrays of functions that pick from and assign to a given type (assembling it).
The composed "assembly" is like a pipe that steps through each function merging input with any
returned props and passing it to the next, returning the assembled result. Common use cases would be
applying a sequence of functions to app state, DB or API results.

The focus of Assemble is to encourage an approach to function composition that is versatile yet
simple to reason about and is type-safe with minimal definition overhead.

---

### Hello World

This sample shows two "assemblers" operating on a props type. These functions benefit from type
hinting for the props they can access and if defined, the props they need to return.

```ts
import { assemble, Assembler } from '@os-gurus/assemble'

interface Props {
  name: string
  message?: string
}

//                                        👇 must return { message }
const prepareMessage: Assembler<Props, 'message'> = ({ name }) => {
  return { message: `Hello ${name}` }
}

//                              👇 must return void (as no props given)
const logMessage: Assembler<Props> = ({ message }) => {
  console.log(message)
}

const sayHello = assemble(prepareMessage, logMessage)

sayHello({ name: 'World' })
// 🖨️ "Hello World"
```

---

### Assembler Functions

The `Assembler` utility creates a definition for a function that can be given to `assemble`. It
declares the props type the function will operate on and can optionally define which props it will
return (it can also return void or conditionally undefined).

Examples of generated function definitions:

```ts
type Props = { message?: string, name?: string }

Assembler<Props, 'message'>
// ➥ (props: Props) => { message: string }

Assembler<Props, 'message' | undefined>
// ➥ (props: Props) => { message?: string }

Assembler<Props, 'name' | 'message'>
// ➥ (props: Props) => { message: string, name: string }

Assembler<Props, void>
// ➥ (props: Props) => void
```

---

### Async Assemblers

`AsyncAssembler` works exactly as `Assembler` for asynchronous functions and `assemble` can compose
a mixture of async and sync assemblers.

`assembleSync` can be used to enforce synchronous functions and a non-promise return.

```ts
import fetch from 'node-fetch'
import { assemble, Assembler, AsyncAssembler } from '@os-gurus/assemble'

interface Props {
  name?: string
  message?: string
}

const fetchName: AsyncAssembler<Props, 'name'> = async () => {
  const { results } = await fetch('https://randomuser.me/api').then(res => res.json())
  const { title, first } = results[0].name
  return { name: `${title} ${first}` }
}

const prepareMessage: Assembler<Props, 'message'> = ({ name }) => {
  return { message: `Hello ${name}` }
}

const logMessage: Assembler<Props, void> = ({ message }) => {
  console.log(message)
}

const sayHello = assemble(fetchName, prepareMessage, logMessage)

sayHello({})
// 🖨️  "Hello {RANDOM_NAME}"
```

---

### Mixing Function Types

Assemble will accept a range of function types and create an input type that merges all function
prop types, while also returning the intersection of all input and assigned props. It can even take
anonymous functions that are typed inline.

```ts
import { assembleSync, Assembler } from '@os-gurus/assemble'

type NumberProps = { one?: boolean, two?: boolean }
type LetterProps = { a?: boolean, b?: boolean }

const assignOne: Assembler<NumberProps, 'one'> = () => ({ one: true })
const assignA: Assembler<LetterProps, 'a'> = () => ({ a: true })

const mixedAssembly = assembleSync(
  assignOne,
  assignA,
  () => ({ foo: true }),
)
// ➥ Param { a?: boolean, b?: boolean, one?: boolean, two?: boolean }
//         ☝️ All function prop types are merged into one

mixedAssembly({})
// ➥ Returns { a: boolean, b?: boolean, foo: boolean, one: boolean, two?: boolean }
//            ☝️ Given assemblers provide `a` and `one` so they're no longer optional

mixedAssembly({ b: true })
// ➥ Returns { a: boolean, b: true, foo: boolean, one: boolean, two?: boolean }
//                        ☝️ `b` is given so its prop type is narrowed to a literal
```

---

### Known Issues

**Merged type constraints override**

Using `MergeUnion` on function's input and prop types to cast the return type of `assemble` creates
a type error. Because 'Returned' could be instantiated with a different subtype of constraint '{}'.
It is overridden by first casting to `unknown`. It can also be avoided by not merging props into one
type and instead returning a union of all props, but that becomes unreadable for assemblies that
have more than a few functions.

It would be nice to have a solution that avoids override casting, because there's a potential for it
to return a different type at run time, which could cause false positive type checks.

**Does not infer mutable props**

The `assemble` return type merges the union of assembler props, assemble input and assembler returns
in that order. However, the input type is narrowed because it is given explicitly, which overrides
its wider type in the props.

e.g. An `Assembler` returns `{ a: boolean }` but `assemble` is given `{ a: true }`, the return type
will be `{ a: true }` — In this case the assembler could override input and set `{ a: false }` and
the return type would be wrong.

It would be nice if it was possible for the assigned `AssembledProps` type to override the input
even though it's wider, it would be safer.
