import { createRouter, createWebHashHistory } from 'vue-router'
import Mine from '@views/mine/mine'
import Recommend from '@views/recommend/recommend'
import SocialContact from '@views/social-contact/social-contact/'
import Singer from '@views/singer/singer'
import Rank from '@views/rank/rank'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/mine',
    component: Mine
  },
  {
    path: '/recommend',
    component: Recommend
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

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
