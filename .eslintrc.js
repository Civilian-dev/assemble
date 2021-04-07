module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    'jest/globals': true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'standard'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-use-before-define': 'off',
    'no-commented-out-tests': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    "@typescript-eslint/no-unused-variable": [true, {"ignore-pattern": "^_"}]
  }
}
