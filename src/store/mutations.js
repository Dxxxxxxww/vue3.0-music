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
  },
  setSongLyric(state, { song, lyric }) {
    state.playList.forEach(item => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
    })
  },
  setSearchHistory(state, searchHistory) {
    state.searchHistory = searchHistory
  },
  setPlayHistory(state, songs) {
    state.playHistory = songs
  }
  // setWrapperTransform(state, transform) {
  //   state.wrapperTransform = transform
  // }
}

export default mutations
