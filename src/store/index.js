import Vuex from 'vuex'
import singerModule from './singerModule'

export default Vuex.createStore({
  modules: {
    singerModule
  }
})
