import { playMode } from '@/config/config'

export default {
  namespaced: true,
  state: () => ({
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    playMode: playMode.sequence,
    currentIndex: -1
  }),
  mutations: {
    setSinger(state, singer) {
      state.singer = singer
    },
    setPlaying(state, flag) {
      state.playing = flag
    },
    setFullScreen(state, flag) {
      state.fullScreen = flag
    },
    setPlayList(state, list) {
      state.playList = list
    },
    setSequenceList(state, list) {
      state.sequenceList = list
    },
    setPlayMode(state, mode) {
      state.playMode = mode
    },
    setCurrentIndex(state, index) {
      state.currentIndex = index
    }
  },
  actions: {
    selectPlay({ commit, state }, { list, index }) {
      commit('setSequenceList', list)
      commit('setPlayList', list)
      commit('setCurrentIndex', index)
      commit('setFullScreen', true)
      commit('setPlaying', true)
    }
  },
  getters: {
    currentSong(state) {
      return state.playList[state.currentIndex] || {}
    }
  }
}
