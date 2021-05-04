import { assemble, Assembler } from '../'

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
