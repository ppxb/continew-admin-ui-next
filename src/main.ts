import { createApp } from 'vue'

import { setupI18n } from './locales'

import App from './App.vue'
import './style.css'

async function bootstrap() {
  const app = createApp(App)

  setupI18n(app)

  app.mount('#app')
}

bootstrap()
