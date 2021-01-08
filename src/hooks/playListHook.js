import { computed, watch, onActivated } from 'vue' // onMounted
import { useStore } from 'vuex'

export default function playListHook(elm) {
  const store = useStore()
  const playList = computed(() => store.state.musicModule.playList)

  handlePlayList(playList.value)
  // 因为在各个组件中调用都是放在 onMounted() 中调用的，需要确保 ref 已经绑定 dom 元素
  // 所以这里的 onMounted 就可有可无，或者说不会触发
  // onMounted(() => {
  //   console.log('onMounted')
  //   handlePlayList(playList.value)
  // })

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
    elm.style.bottom = bottom
  }
}
