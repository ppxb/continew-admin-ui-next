import type { Theme } from 'unocss/preset-uno'
import { defineConfig } from 'unocss/vite'

export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
})
