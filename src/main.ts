import { createApp } from 'vue'

import { setupI18n } from './locales'
import { setupDayjs, setupNProgress } from './plugins'

import App from './App.vue'
import './style.css'

async function bootstrap() {
  const app = createApp(App)

  setupNProgress()
  setupDayjs()

  setupI18n(app)

  app.mount('#app')
}

bootstrap()
