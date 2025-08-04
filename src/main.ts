import { createApp } from 'vue'

import { setupI18n } from './locales'
import { setupDayjs, setupNProgress } from './plugins'
import { setupStore } from './store'

import App from './App.vue'
import './style.css'

async function bootstrap() {
  const app = createApp(App)

  setupNProgress()

  setupDayjs()

  setupStore(app)

  setupI18n(app)

  app.mount('#app')
}

bootstrap()
