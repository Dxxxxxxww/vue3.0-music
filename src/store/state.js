import {
  PLAY_MODE,
  SEARCH_KEY
} from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  playList: [],
  sequenceList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  wrapperTransform: '',
  favoriteList: [],
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
