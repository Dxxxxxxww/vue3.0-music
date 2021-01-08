import { playMode } from '@/config/config'
import * as types from './musicModuleType'
import { shuffle } from '@/utils/utils'

export default {
  namespaced: true,
  state: () => ({
    singer: {},
    disc: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    playMode: playMode.sequence,
    currentIndex: -1
  }),
  mutations: {
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    },
    [types.SET_DISC](state, disc) {
      state.disc = disc
    },
    [types.SET_PLAYING](state, flag) {
      state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
      state.fullScreen = flag
    },
    [types.SET_PLAY_LIST](state, list) {
      state.playList = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
      state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
      state.playMode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
      state.currentIndex = index
    }
  },
  actions: {
    selectPlay({ commit }, { list, index }) {
      commit(types.SET_SEQUENCE_LIST, list)
      commit(types.SET_PLAY_LIST, list)
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING, true)
    },
    randomPlay({ commit }, { list }) {
      commit(types.SET_PLAY_MODE, playMode.random)
      commit(types.SET_SEQUENCE_LIST, list)
      const randomList = shuffle(list)
      commit(types.SET_PLAY_LIST, randomList)
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING, true)
    }
  },
  getters: {
    currentSong(state) {
      return state.playList[state.currentIndex] || {}
    },
    currentIndex(state) {
      return state.currentIndex
    },
    playing(state) {
      return state.playing
    },
    playMode(state) {
      return state.playMode
    },
    playList(state) {
      return state.playList
    },
    sequenceList(state) {
      return state.sequenceList
    }
  }
}
