import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '',
        component: () => import('@/views/viewer'),
        name: 'Viewer'
      },
      {
        path: 'comic',
        component: () => import('@/views/comic-viewer'),
        name: 'ComicViewer'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
