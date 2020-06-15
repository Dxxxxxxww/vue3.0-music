import Vuex from 'vuex'
import singerModule from './singer-module'

export default Vuex.createStore({
  modules: {
    singerModule
  }
})
