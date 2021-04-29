import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import registerDirective from '@/directives'
import '@/assets/scss/index.scss'

const app = createApp(App)

registerDirective(app)

app
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
  })
  .mount('#app')
