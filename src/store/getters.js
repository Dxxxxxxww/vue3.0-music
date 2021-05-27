const getters = {
  currentSong: state => state.playList[state.currentIndex] ?? {}
}

export default getters
