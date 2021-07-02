import { useStore } from 'vuex'
import { clear, remove, save } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'

export default function useSearchHistory() {
  const maxLen = 20
  const store = useStore()

  function saveSearch(query) {
    const searches = save(query, SEARCH_KEY, item => item === query, maxLen)
    store.commit('setSearchHistory', searches)
  }

  function deleteSearch(query) {
    const searches = remove(query, SEARCH_KEY, item => item === query)
    store.commit('setSearchHistory', searches)
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
