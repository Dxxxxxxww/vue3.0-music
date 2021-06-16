import { onMounted, onUnmounted, ref } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)

export function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    if (options.probeType > 0) {
      scroll.value.on('scroll', pos => {
        emit('scroll', pos)
      })
      scroll.value.on('scrollEnd', pos => {
        emit('scrollEnd', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    scroll
  }
}
