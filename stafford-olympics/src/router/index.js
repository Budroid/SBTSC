import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '@/firebase';
import Login from '@/views/Login.vue'
import Installation from '@/views/Installation.vue'
import Tournaments from '@/views/Tournaments.vue'
import Dogs from '@/views/Dogs.vue'
import Profile from '@/views/Profile.vue'
import Users from '@/views/Users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Tournaments',
    component: Tournaments,
    meta: {
      auth: true,
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      auth: true,
      page: {
        title: "User management",
        back: true
      }

    }
  },
  {
    path: '/dogs',
    name: 'Dogs',
    component: Dogs,
    meta: {
      auth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      auth: true
    }
  },
  {
    path: '/login',
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
      public: true
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

let router = new VueRouter({
  mode: 'history',
  routes
})

const isStandAlone = () => {
  return window.matchMedia("(display-mode: standalone)").matches
}

router.beforeEach((to, from, next) => {
  if (to.name !== from.name) {
    if (to.matched.some(record => record.meta.auth)) {
      // Routes naar pages waarvoor authenticatie vereist is
      if (isStandAlone()) {
        auth.onAuthStateChanged(user => {
          if (user) {
            // User is ingelogd, dus heeft toestemming deze page te benaderen. Doorgaan.
            next()
          } else {
            // User is NIET ingelogd, maar wil naar een page waarvoor dat wel vereist is. Naar login.
            next({ path: "/login" })
          }
        })
      } else {
        // Local development:
        // next()
        next({ path: "/installation" })
      }
    } else if (to.matched.some(record => record.meta.guest)) {
      // Routes naar pages waarvoor GEEN authenticatie vereist is, maar wel installatie
      // console.log("Bericht vanuit router. verzoek om " + to.name + " met standalone = " + isStandAlone())
      if (isStandAlone()) {
        auth.onAuthStateChanged(user => {
          if (user) {
            // User is al ingelogd, dus komt niet langs login maar direct naar beginscherm van de app
            next({ path: "/" })
          } else {
            // User is niet ingelogd, maar dat hoeft ook niet voor deze page. Doorgaan
            next()
          }
        })
      }
      else {
        // Dit kan in het geval van een desktop applicatie
        next()
      }
    } else {
      // De overige (public) routes altijd toestaan
      next()
    }
  }

})
export default router
