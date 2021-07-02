import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const RELATIVE_CLS = 'g-relative'

/**
 * @author: dxw
 * @date: 2021/5/25 11:17 上午
 * @description: 创建类似 loading 公共组件的指令
 * @param {*} Comp loading, no-result 等公共组件
 * @returns {*} 自定义指令
 */
export function createLoadingLikeDirective(Comp) {
  // 公共组件的 name ，而非使用指令的组件 name
  // 通过 name 来将 instance 绑定到组件的 name 上，
  // 有了这样一层隔离，多个自定义指令用在同一个组件上就不会覆盖 instance
  const name = Comp.name
  const directive = {
    mounted(el, binding) {
      const app = createApp(Comp)
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = app.mount(document.createElement('div'))
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
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    removeClass(el, RELATIVE_CLS)
    el.removeChild(el[name].instance.$el)
  }

  function setTitle(el, title) {
    if (typeof title !== 'undefined') {
      el[name].instance.setTitle(title)
    }
  }

  return directive
}
