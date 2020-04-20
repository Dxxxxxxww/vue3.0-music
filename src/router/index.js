import Vue from 'vue'
import VueRouter from 'vue-router'
import Mine from '@views/mine/mine'
import Discovery from '@views/discovery/discovery'
import SocialContact from '@views/social-contact/social-contact/'
import Singer from '@views/singer/singer'
import Rank from '@views/rank/rank'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/mine',
    component: Mine
  },
  {
    path: '/discovery',
    component: Discovery
  },
  {
    path: '/social-contact',
    component: SocialContact
  },
  {
    path: '/singer',
    component: Singer
  },
  {
    path: '/rank',
    component: Rank
  }
]

const router = new VueRouter({
  routes
})

export default router
