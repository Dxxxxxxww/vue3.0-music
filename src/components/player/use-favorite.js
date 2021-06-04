import { computed } from 'vue'
import { useStore } from 'vuex'
import { remove, save } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const maxLen = 100
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)

  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(song) {
    let list

    if (isFavorite(song)) {
      // remove
      list = remove(song, FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }

    store.commit('setFavoriteList', list)
    // 起初我想把这个函数写在外面，但是这样一来 song 就得通过传值方式获取，
    // 放在里面利用闭包更方便
    function compare(item) {
      return item.id === song.id
    }
  }

  function isFavorite(song) {
    return favoriteList.value.findIndex(item => song.id === item.id) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
