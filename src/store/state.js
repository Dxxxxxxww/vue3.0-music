import { FAVORITE_KEY, PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  playList: [],
  sequenceList: [],
  favoriteList: load(FAVORITE_KEY),
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  wrapperTransform: '',
  searchHistory: load(SEARCH_KEY)
}

export default state
