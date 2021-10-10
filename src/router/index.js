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
  },
  {
    path: '/setting',
    component: () => import('@/views/setting'),
    children: [
      {
        path: '',
        name: 'Setting'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
