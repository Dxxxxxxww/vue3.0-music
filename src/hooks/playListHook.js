import { computed, watch, onMounted, onActivated } from 'vue'
import { useStore } from 'vuex'

export default function playListHook(elm) {
  const store = useStore()
  const playList = computed(() => store.state.singerModule.playList)

  onMounted(() => {
    console.log('onMounted')
    handlePlayList(playList.value)
  })

  onActivated(() => {
    console.log('activated')
    // onActivated 不触发，就很尴尬，Singer 滚动就解决不了了
    handlePlayList(playList.value)
  })

  watch(playList, newVal => {
    console.log('watch')
    handlePlayList(newVal)
  })

  function handlePlayList(playList) {
    const bottom = playList.length > 0 ? '60px' : ''
    if (elm) {
      elm.style.bottom = bottom
    }
  }
}
