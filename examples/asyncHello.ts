import {
	assemble,
	type Assembler,
	type AsyncAssembler,
	type NonAssembler,
} from '../src'

type Props = {
	name?: string
	message?: string
}

const fetchName: AsyncAssembler<Props, 'name'> = async () => {
	const { results } = await fetch('https://randomuser.me/api').then((res) =>
		res.json(),
	)
	const { title, first } = results[0].name
	return { name: `${title} ${first}` }
}

const prepareMessage: Assembler<Props, 'message'> = ({ name }) => {
	return { message: `Hello ${name}` }
}

const logMessage: NonAssembler<Props> = ({ message }) => {
	console.log(message)
}

const sayHello = assemble(fetchName, prepareMessage, logMessage)

await sayHello({})
// 🖨️  "Hello {RANDOM_NAME}"
