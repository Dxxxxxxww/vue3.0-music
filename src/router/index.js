import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () =>
  import('@/views/recommend.vue' /* webpackChunkName: "recommend" */)
const Album = () =>
  import('@/views/album.vue' /* webpackChunkName: "album" */)
const Search = () =>
  import('@/views/search.vue' /* webpackChunkName: "search" */)
const Singer = () =>
  import('@/views/singer.vue' /* webpackChunkName: "singer" */)
const TopList = () =>
  import('@/views/top-list.vue' /* webpackChunkName: "top-list" */)
const SingerDetail = () =>
  import('@/views/singer-detail.vue' /* webpackChunkName: "singer-detail" */)
const TopDetail = () =>
  import('@/views/top-detail' /* webpackChunkName: "top-detail" */)
const UserCenter = () =>
  import('@/views/user-center' /* webpackChunkName: "user-center" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    name: '推荐',
    path: '/recommend',
    component: Recommend,
    children: [
      {
        name: '歌单详情',
        path: ':id',
        component: Album,
        props: true
      }
    ]
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
    component: TopList,
    children: [
      {
        name: '排行详情',
        path: ':id',
        component: TopDetail,
        props: true
      }
    ]
  },
  {
    name: '搜索',
    path: '/search',
    component: Search,
    children: [
      {
        // name 不能重复，如果重复，则后路由会覆盖前路由
        name: '搜索歌手详情',
        path: ':id',
        component: SingerDetail,
        props: true
      }
    ]
  },
  {
    name: '用户中心',
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
