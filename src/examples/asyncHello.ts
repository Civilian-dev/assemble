import fetch from 'node-fetch'
import { assemble, Assembler, AsyncAssembler } from '../'

interface Props {
  name?: string
  message?: string
}

const fetchName: AsyncAssembler<Props, 'name'> = async () => {
  const { results } = await (await fetch('https://randomuser.me/api')).json()
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
