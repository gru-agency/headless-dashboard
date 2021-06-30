module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
    'plugin:@intlify/vue-i18n/recommended',
  ],
  plugins: [],
  rules: {
    '@intlify/vue-i18n/key-format-style': ['error', 'camelCase'],
    '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
    '@intlify/vue-i18n/no-dynamic-keys': 'error',
    '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
    '@intlify/vue-i18n/no-raw-text': 'off',
    '@intlify/vue-i18n/prefer-linked-key-with-paren': 'error',
  },
  settings: {
    'vue-i18n': {
      localeDir: '~/locales/*.{json,json5,yaml,yml}',
      messageSyntaxVersion: '^8.24.5',
    },
  },
}
