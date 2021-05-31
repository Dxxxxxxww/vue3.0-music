import { computed, onMounted, ref } from 'vue'

export function useStyle(props) {
  const RESERVED_HEIGHT = 40

  const scrollY = ref(0)
  const maxTranslateY = ref(0)
  const imageHeight = ref(0)
  const bgImage = ref(null)

  const bgImageStyle = computed(() => {
    const scrollYVal = scrollY.value,
      maxTranslateYVal = maxTranslateY.value

    let height = 0,
      paddingBottom = '70%',
      zIndex = 0,
      scale = 1,
      // 兼容 ios 移动端问题
      translateZ = 0
    // 当大于最大距离时，就说明需要留出头部位置了
    if (scrollYVal > maxTranslateYVal) {
      zIndex = 10
      paddingBottom = '0'
      height = `${RESERVED_HEIGHT}px`
      translateZ = 1
    }

    // 向下滑
    if (scrollYVal < 0) {
      scale = 1 + Math.abs(scrollYVal / maxTranslateYVal)
    }

    return {
      zIndex,
      paddingBottom,
      height,
      backgroundImage: `url(${props.pic})`,
      transform: `scale(${scale})translateZ(${translateZ}px)`
    }
  })

  const filterStyle = computed(() => {
    let blur = 0
    const imageHeightVal = imageHeight.value,
      scrollYVal = scrollY.value,
      multiple = 20
    // 向上滑动时
    if (scrollYVal >= 0) {
      // blur 的最大值是 最大向上滑动距离 / 图片高度
      blur =
        Math.min(
          maxTranslateY.value / imageHeightVal,
          scrollYVal / imageHeightVal
        ) * multiple
    }
    return {
      backdropFilter: `blur(${blur}px)`
    }
  })

  const scrollStyle = computed(() => {
    return {
      top: `${imageHeight.value}px`
    }
  })

  const playBtnStyle = computed(() => {
    let display = 'block'
    if (scrollY.value >= maxTranslateY.value) {
      display = 'none'
    }
    return {
      display
    }
  })

  onMounted(() => {
    imageHeight.value = bgImage.value.clientHeight
    // 歌词列表向上滚动的最大距离
    maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
  })

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    bgImage,
    bgImageStyle,
    filterStyle,
    scrollStyle,
    playBtnStyle,
    onScroll
  }
}
