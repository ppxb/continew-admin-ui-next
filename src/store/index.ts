import { createPinia } from 'pinia'
import type { App } from 'vue'

import { resetStore } from './plugin'

export function setupStore(app: App) {
  const store = createPinia()

  store.use(resetStore)

  app.use(store)
}
