import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)

export default function useMiniSlider() {
  // data
  // slider 容器
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  // computed
  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)
  // 确保 miniPlayer 显示 及 有歌曲播放列表时，初始化 slider
  const sliderShow = computed(
    () => !fullScreen.value && !!playList.value.length
  )

  onMounted(() => {
    let sliderVal
    // vue 的数据更改到 dom 变化，实际上隔着一个 nextTick，
    // 它需要在 nextTick 之后，才会正确的获取到 dom。
    // 如果我们定义了一个方法需要获取到 dom，或者访问 dom 的一些 属性。
    // 并且这个方法在数据变化后就立刻执行，我们需要加一个 nextTick.then() 来确保 dom 已经重新渲染
    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          // 如果已经有 bs实例 了就刷新 slider
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    // 在播放列表里移除歌曲时，数据变化了，但是 slider 没有刷新，
    // 导致存在已删除歌曲在 slider 中依然存在的问题，所以需要对 playList 监听进行刷新处理
    // 没有播放列表时，如果刷新 slider 会报错，因为 slider 要求至少一个子元素
    // 切记：如果依赖的数据变化要手动去操作 dom 时，需要等待一个 nextTick ！
    watch(playList, async newPlayList => {
      if (sliderVal && sliderShow && newPlayList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
