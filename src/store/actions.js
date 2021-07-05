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
  },
  removeSong({ commit, state }, song) {
    const playList = state.playList.slice()
    const sequenceList = state.sequenceList.slice()

    const playIndex = findIndex(playList, song)
    const sequenceIndex = findIndex(sequenceList, song)
    // 如果找不到歌曲就直接返回
    if (playIndex < 0 || sequenceIndex < 0) {
      return
    }
    // 删除当前歌曲
    playList.splice(playIndex, 1)
    sequenceList.splice(sequenceIndex, 1)
    // 修改当前播放歌曲
    let currentIndex = state.currentIndex
    // 如果移除歌曲的 index 小于 当前播放歌曲的index
    // 或者当前播放歌曲是最后一首歌曲，并且移除了最后一首歌曲，此时播放歌曲下标>=数组，也需要自减
    if (playIndex < currentIndex || currentIndex === playList.length) {
      currentIndex--
    }

    commit('setPlayList', playList)
    commit('setSequenceList', sequenceList)
    commit('setCurrentIndex', currentIndex)
    if (!playList.length) {
      commit('setPlayingStatus', false)
    }
  },
  clearSongList({ commit }) {
    commit('setPlayList', [])
    commit('setSequenceList', [])
    commit('setCurrentIndex', 0)
    commit('setPlayingStatus', false)
  },
  addSong({ commit, state }, song) {
    let currentIndex = state.currentIndex
    const playList = state.playList.slice()
    const sequenceList = state.sequenceList.slice()
    const playIndex = findIndex(playList, song)
    // 如果在播放列表中找到了要添加的歌曲, 则直接切换 index
    if (playIndex > -1) {
      currentIndex = playIndex
    } else {
      // 如果不在播放列表中，添加歌曲后再切换 index
      playList.push(song)
      sequenceList.push(song)
      currentIndex = playList.length - 1
    }

    commit('setCurrentIndex', currentIndex)
    commit('setPlayList', playList)
    commit('setSequenceList', sequenceList)
    commit('setFullScreen', true)
    commit('setPlayingStatus', true)
  }
}

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}

export default actions
