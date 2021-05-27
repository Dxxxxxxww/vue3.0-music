const mutations = {
  setPlayList(state, list) {
    state.playList = list
  },
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  setPlayingStatus(state, playing) {
    state.playing = playing
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

export default mutations
