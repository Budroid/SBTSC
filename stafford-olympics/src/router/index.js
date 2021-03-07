import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Installation from '../views/Installation.vue'


Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: Home,
  //   meta: {
  //     auth: true
  //   }
  // },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/installation',
    name: 'Installation',
    component: Installation,
    meta: {
      guest: true
    }
  },
  // {
  //   path: '*',
  //   name: 'Default',
  //   component: Home,
  //   meta: {
  //     auth: true
  //   }
  // }

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
