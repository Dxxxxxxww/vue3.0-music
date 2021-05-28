import { createLogger, createStore } from 'vuex'
import state from '@/store/state'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  // 严格模式，确保状态更改是通过 mutations 进行的，开启后会深度watch state 的变化，耗费性能所以只在开发环境打开
  strict: debug,
  // createLogger 创建一个可以查看提交情况的插件
  plugins: debug ? [createLogger()] : []
})
