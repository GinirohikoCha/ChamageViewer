import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'

import App from './App.vue'

const routes = [
  { path: '/', component: () => import('@/view/viewer/Viewer') },
  { path: '/config', component: () => import('@/view/config/Config') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
