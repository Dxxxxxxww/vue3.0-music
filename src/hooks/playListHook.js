import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

export default function playListHook(elm) {
  const store = useStore()
  const playList = computed(() => store.state.singerModule.playList)

  onMounted(() => {
    handlePlayList(playList.value)
  })

  watch(playList, newVal => {
    handlePlayList(newVal)
  })

  function handlePlayList(playList) {
    const bottom = playList.length > 0 ? '60px' : ''
    elm.style.bottom = bottom
  }
}
