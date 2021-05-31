import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

const actions = {
  selectPlay({ commit }, { list, index }) {
    commit('setPlayList', list)
    commit('setSequenceList', list)
    commit('setPlayingStatus', true)
    commit('setFullScreen', true)
    commit('setCurrentIndex', index)
    commit('setPlayMode', PLAY_MODE.sequence)
  },
  randomPlay({ commit }, list) {
    commit('setPlayList', shuffle(list))
    commit('setSequenceList', list)
    commit('setPlayingStatus', true)
    commit('setFullScreen', true)
    commit('setCurrentIndex', 0)
    commit('setPlayMode', PLAY_MODE.random)
  }
}
export default actions
