// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.js', '**/*.ts', '**/*.vue'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'camelcase': 0,
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'no-console': ['error', {
      allow: ['info', 'warn', 'trace', 'error'],
    }],
  },
})
