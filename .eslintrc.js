module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  plugins: [],
  rules: {
    // 'no-unused-vars': 'warn',
    // 'object-shorthand': 'warn',
  },
  settings: {},
}
