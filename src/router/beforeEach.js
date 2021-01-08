import router from './index'

router.beforeEach((to, from, next) => {
  console.log(to, from)
  next()
})
