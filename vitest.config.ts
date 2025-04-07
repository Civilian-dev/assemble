import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['**/*.test.ts', '**/*.test-d.ts'],
		root: 'src',
		coverage: {
			reporter: 'text',
			provider: 'istanbul',
			exclude: ['**/index.ts'],
		},
	},
})
