import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/UserLogin.vue'
import Home from './../components/WebHome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// to：将要访问的路径
// from: 从那个路径来的
// next:是一个函数，表示放行，next()或next(‘/login’)
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
