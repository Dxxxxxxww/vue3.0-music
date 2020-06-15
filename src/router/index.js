import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '@views/recommend/Recommend'
const Mine = () => import('@views/mine/Mine')
const SocialContact = () => import('@views/social-contact/SocialContact')
const Singer = () => import('@views/singer/Singer')
const SingerDetail = () => import('@views/singer-detail/SingerDetail')
const Rank = () => import('@views/rank/Rank')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/social-contact',
    name: 'SocialContact',
    component: SocialContact
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        name: 'SingerDetail',
        component: SingerDetail
      }
    ]
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
