import Loading from './loading'
import { createApp } from 'vue'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    el.instance = app.mount(document.createElement('div'))

    if (binding.value) {
      append(el)
    }
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  el.appendChild(el.instance.$el)
}

function remove(el) {
  el.removeChild(el.instance.$el)
}

export default loadingDirective
