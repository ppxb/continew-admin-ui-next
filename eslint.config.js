import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'

export default antfu({
  vue: true,
  unocss: true,
  formatters: {
    html: true,
    css: true,
    json: true,
  },
  rules: {
    'style/comma-dangle': 'off',
    'ts/consistent-type-definitions': 'off',
    'perfectionist/sort-imports': 'off'
  },
}).overrideRules(prettier)
