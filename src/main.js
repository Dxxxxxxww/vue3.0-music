import '@babel/polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import '@/router/beforeEach.js'
// import VueLazyload from 'vue-lazyload'
import lazyPlugin from 'vue3-lazy'

import '@styles/index.styl'

fastclick.prototype.focus = function(targetElement) {
  let length
  if (
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month'
  ) {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}
fastclick.attach(document.body)

// VueLazyload 目前不支持 vue3.0
// .use(VueLazyload, { loading: require('@/assets/img/logo@2x.png') })
createApp(App)
  .use(router)
  .use(store)
  .use(lazyPlugin, {
    loading: require('@/assets/img/logo@2x.png'),
    error: require('@/assets/img/logo@2x.png')
  })
  .mount('#app')
