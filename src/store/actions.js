import { PLAY_MODE } from '@/assets/js/constant'

const actions = {
  selectPlay({ commit }, { list, index }) {
    commit('setPlayList', list)
    commit('setSequenceList', list)
    commit('setPlayingStatus', true)
    commit('setFullScreen', true)
    commit('setCurrentIndex', index)
    commit('setPlayMode', PLAY_MODE.sequence)
  }
}
export default actions
