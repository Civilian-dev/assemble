import { assemble, Assembler } from '../'

/**
 * This sample shows two assemblers operating on `Props`. These functions benefit from type hinting
 * for the arguments they can take from props and if defined, the props they need to return.
*/

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
