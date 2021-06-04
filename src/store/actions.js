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
  },
  changeMode({ commit, state, getters }, mode) {
    const currentId = getters.currentSong.id

    if (mode === PLAY_MODE.random) {
      commit('setPlayList', shuffle(state.sequenceList))
    } else {
      commit('setPlayList', state.sequenceList)
    }
    const index = state.playList.findIndex(song => currentId === song.id)
    commit('setCurrentIndex', index)
    commit('setPlayMode', mode)
  }
}
export default actions
