import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.js', '**/*.ts', '**/*.vue'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    'camelcase': 0,
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/multi-word-component-names': 'off',
    "vue/no-mutating-props" : "off",
    'vue/no-v-html': 'off',
    'no-console': ['error', {
      allow: ['info', 'warn', 'trace', 'error'],
    }],
  },
})
