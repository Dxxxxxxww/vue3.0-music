import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  playList: [],
  sequenceList: [],
  favoriteList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false
}

export default state
