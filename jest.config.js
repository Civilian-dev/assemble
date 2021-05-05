module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: [
    '**/test/dts-jest/**/*.test.ts',
    '**/src/**/*.test.ts'
  ],
  transform: {
    'test/dts-jest/.+\\.ts$': 'dts-jest/transform'
  },
  reporters: ['default', 'dts-jest/reporter'],
  globals: {
    _dts_jest_: {
      compiler_options: './tsconfig.json',
      enclosing_declaration: true
    }
  }
}
