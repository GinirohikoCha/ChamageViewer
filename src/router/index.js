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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
