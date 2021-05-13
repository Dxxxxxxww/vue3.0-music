import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import('@/views/recommend.vue')
const Search = () => import('@/views/search.vue')
const Singer = () => import('@/views/singer.vue')
const TopList = () => import('@/views/top-list.vue')
const SingerDetail = () => import('@/views/singer-detail.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    name: '推荐',
    path: '/recommend',
    component: Recommend
  },
  {
    name: '歌手',
    path: '/singer',
    component: Singer,
    children: [
      {
        name: '歌手详情',
        path: ':id',
        component: SingerDetail,
        props: true
      }
    ]
  },
  {
    name: '排行',
    path: '/top-list',
    component: TopList
  },
  {
    name: '搜索',
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
