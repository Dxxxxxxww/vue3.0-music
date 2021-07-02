import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import PullUp from '@better-scroll/pull-up'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)
BScroll.use(PullUp)

export default function usePullUpLoad(requestData, preventPullUpLoad) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpload = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      observeDOM: true,
      pullUpLoad: true,
      click: true
    }))

    scrollVal.on('pullingUp', pullUpHandler)

    async function pullUpHandler() {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpload.value = true
      await requestData()
      scrollVal.finishPullUp()
      isPullUpload.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    rootRef,
    scroll,
    isPullUpload
  }
}
