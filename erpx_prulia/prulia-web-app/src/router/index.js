import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/home')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile'),
    meta: { auth: true }
  },
  {
    path: '/view/:id',
    name: 'View',
    component: () => import('@/views/view'),
    meta: { showBack: true }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/news'),
    meta: { showBack: true }
  },
  {
    path: '/news/:id',
    name: 'NewsDetails',
    component: () => import('@/views/news/Details'),
    meta: { showBack: true }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/events'),
    meta: { showBack: true }
  },
  {
    path: '/events/:id',
    name: 'EventDetails',
    component: () => import('@/views/events/Details'),
    meta: { auth: true, showBack: true }
  },
  {
    path: '/training',
    name: 'Training',
    component: () => import('@/views/training'),
    meta: { showBack: true }
  },
  {
    path: '/training/:id',
    name: 'TrainingDetails',
    component: () => import('@/views/training/Details'),
    meta: { auth: true, showBack: true }
  },
  {
    path: '/smart-partners',
    name: 'SmartPartners',
    component: () => import('@/views/smart-partners'),
    meta: { showBack: true }
  },
  {
    path: '/smart-partners/:id',
    name: 'SmartPartnersDetails',
    component: () => import('@/views/smart-partners/Details'),
    meta: { auth: true, showBack: true }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/about')
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.getters['auth/member']) {
    if (store.getters['auth/loaded']) {
      next({ name: 'Login' })
    } else {
      store
        .dispatch('auth/load')
        .then(() => {
          next()
        })
        .catch(() => {
          next({ name: 'Login' })
        })
    }
    return
  }
  next()
})

export default router