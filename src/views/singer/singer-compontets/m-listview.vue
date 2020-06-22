<template>
  <m-scroll
    class="listview"
    :data="data"
    ref="scrollRef"
    :probe-type="probeType"
    :listen-scroll="true"
    @scroll="handleScroll"
  >
    <ul>
      <li
        class="list-group"
        v-for="(group, index) of data"
        :key="group.title"
        :ref="elem => (listGroupRef[index] = elem)"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item of group.items"
            :key="item.id"
            @click="handleClickItem(item)"
          >
            <img class="avatar" :src="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-lettersRef"
      @touchstart.stop.prevent="handleLetterTouchStart"
      @touchmove.stop.prevent="handleLetterTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          class="letter"
          v-for="(item, index) of lettersRef"
          :key="item"
          :data-index="index"
          :class="{ current: currentIndexRef === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixedRef" v-show="fixedTitleRef">
      <div class="fixed-title">{{ fixedTitleRef }}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </m-scroll>
</template>

<script>
import { ref, computed, watch } from 'vue'
import MScroll from '@components/m-scroll/index'
import Loading from '@components/loading/loading'
import { getDomData } from '@/utils/dom'

const LETTER_HEIGHT = 18
const FIXED_TITLE_HEIGHT = 30

export default {
  name: 'MListview',
  components: {
    MScroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, context) {
    const listGroupRef = ref([])
    const probeType = 3
    const lettersRef = computed(() =>
      props.data.map(v => {
        return v.title.substr(0, 1)
      })
    )

    const { heightList } = useGetHeightList(props, listGroupRef)
    const {
      currentIndexRef,
      scrollYRef,
      fixedRef,
      handleScroll
    } = useScrollLogic(heightList)

    const {
      scrollRef,
      handleLetterTouchStart,
      handleLetterTouchMove
    } = useLetterLogic(heightList, listGroupRef)

    const fixedTitleRef = computed(() => {
      if (scrollYRef.value > 0) {
        return ''
      }
      return props.data[currentIndexRef.value]
        ? props.data[currentIndexRef.value].title
        : ''
    })

    const handleClickItem = item => {
      context.emit('select', item)
    }

    return {
      currentIndexRef,
      lettersRef,
      listGroupRef,
      scrollRef,
      fixedTitleRef,
      fixedRef,
      probeType,
      handleScroll,
      handleLetterTouchStart,
      handleLetterTouchMove,
      handleClickItem
    }
  }
}

const useGetHeightList = (props, listGroupRef) => {
  const heightList = []
  watch(
    () => props.data,
    () => {
      setTimeout(() => {
        _getHeightList()
      }, 20)
    }
  )

  function _getHeightList() {
    let height = 0
    heightList.push(height)
    for (const v of listGroupRef.value) {
      height += v.clientHeight
      heightList.push(height)
    }
  }
  return { heightList }
}

const useLetterLogic = (heightList, listGroupRef) => {
  const touchObj = {}
  const scrollRef = ref(null)

  function handleLetterTouchStart(e) {
    const touch = e.touches[0]
    const index = getDomData(e.target, 'index')
    touchObj.y1 = touch.pageY
    touchObj.startIndex = parseInt(index)
    _scrollTo(index)
  }

  function handleLetterTouchMove(e) {
    const touch = e.touches[0]
    touchObj.y2 = touch.pageY
    const moveIndex = ((touchObj.y2 - touchObj.y1) / LETTER_HEIGHT) | 0
    _scrollTo(touchObj.startIndex + moveIndex)
  }

  function _scrollTo(index) {
    if (!index && index !== 0) {
      return
    }
    if (index < 0) {
      index = 0
    } else if (index > heightList.length - 2) {
      index = heightList.length - 2
    }
    // 当点击 letter 的时候 scroll 滚动不触发，则手动赋值 scrollY
    // 当前版本 bscroll 会触发
    // this.scrollY = -heightList[index]
    scrollRef.value.scrollToElem(listGroupRef.value[index])
  }

  return {
    scrollRef,
    handleLetterTouchStart,
    handleLetterTouchMove
  }
}

const useScrollLogic = heightList => {
  const diffRef = ref(0)
  let fixedTop = 0
  const scrollYRef = ref(0)
  const currentIndexRef = ref(0)
  const fixedRef = ref(null)

  watch(scrollYRef, nv => {
    const y = nv
    // 当滚动到顶部
    if (y > 0) {
      currentIndexRef.value = 0
      return
    }
    // 当滚动到中间部分
    // heightList 的长度比元素长度长 1 线段端点与线的关系
    for (let i = 0, len = heightList.length - 1; i < len; i++) {
      const top = heightList[i],
        bottom = heightList[i + 1]
      if (-y >= top && -y < bottom) {
        currentIndexRef.value = i
        // 获取当前歌手块与固定标题的差值
        diffRef.value = bottom + y
        return
      }
    }
    // 当滚动到最后 大于最后一个值的上限 -1 是下限
    currentIndexRef.value = heightList.length - 2
  })

  watch(diffRef, nv => {
    // 获取差值与固定标题高度的差值 _fixedTop为负值刚好让固定标题向上滚动
    const _fixedTop =
      nv > 0 && nv < FIXED_TITLE_HEIGHT ? nv - FIXED_TITLE_HEIGHT : 0
    // 避免不必要的 dom 操作
    if (fixedTop === _fixedTop) {
      return
    }
    fixedTop = _fixedTop
    fixedRef.value.style.transform = `translate3d(0,${fixedTop}px,0)`
  })
  // 使用函数方式，也可以使用 watch
  // handleScroll({ y }) {
  //   if (y > 0) {
  //     currentIndexRef.value = 0
  //     return
  //   }
  //   for (let i = 0, len = heightList.length; i < len; i++) {
  //     const left = heightList[i],
  //       right = heightList[i + 1]

  //     if (-y >= left && -y < right) {
  //       currentIndexRef.value = i
  //       return
  //     }
  //   }
  //   // 大于最后一个值的上限 -1 是下限
  //   currentIndexRef.value = heightList.length - 2
  // },
  function handleScroll({ y }) {
    scrollYRef.value = y
  }

  return { currentIndexRef, fixedRef, scrollYRef, handleScroll }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable'

.listview
  position fixed
  width 100%
  top 44px
  bottom 0
  overflow hidden
  background-color $color-w
  .list-group
    padding-bottom: 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-n
      background-color $color-e-ll
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        padding-left 20px
        color $color-text
        font-size $font-size-medium
  .list-lettersRef
    z-index 30
    position absolute
    top 50%
    right 10px
    transform translate3d(0, -50%, 0)
    display flex
    align-items center
    padding 8px 0
    border-radius 10px
    background-color $color-text-highlight
    .letter
      padding 3px
      line-height 1
      text-align center
      font-size $font-size-small-s
      color $color-text-n
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    background-color $color-e-ll
    .fixed-title
      height 30px
      line-height 30px
      padding-left: 20px
      font-size $font-size-small
      color $color-text-n
  .loading-container
    position absolute
    top 50%
    width 100%
    transform translateY(-50%)
</style>
