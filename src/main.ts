import App from './App.vue'
import { setupPinia } from './store'
import * as Vue from 'vue'
import routeConfig, { setupRouter } from './router'
import { ViteSSG } from 'vite-ssg'

import './assets/main.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'

import ProjectPlugin from './plugins'

window.Vue = Vue

export const createApp = ViteSSG(
  App,
  routeConfig,
  ({ app, router, initialState }) => {
    setupPinia(app, initialState)
    setupRouter(app, router)
    app.use(ProjectPlugin)
  },
)
