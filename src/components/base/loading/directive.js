import Loading from './loading'
import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const RELATIVE_CLS = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    el.instance = app.mount(document.createElement('div'))
    setTitle(el, binding.arg)
    if (binding.value) {
      append(el)
    }
  },

  updated(el, binding) {
    setTitle(el, binding.arg)
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  addClass(el, RELATIVE_CLS)
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, RELATIVE_CLS)
  el.removeChild(el.instance.$el)
}

function setTitle(el, title) {
  if (title) {
    el.instance.setTitle(title)
  }
}

export default loadingDirective
