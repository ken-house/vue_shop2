import Vue from 'vue'
import VueRouter from 'vue-router'
import MenuList from './../components/MenuList.vue'
import PrivilegeList from './../components/PrivilegeList.vue'
import RoleList from './../components/RoleList.vue'
import UserList from './../components/UserList.vue'
import Login from './../components/UserLogin.vue'
import Home from './../components/WebHome.vue'
import Welcome from './../components/WebWelcome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user-list',
        component: UserList
      },
      {
        path: '/menu-list',
        component: MenuList
      },
      {
        path: '/role-list',
        component: RoleList
      },
      {
        path: '/privilege-list',
        component: PrivilegeList
      }
    ]
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
