<template>
  <m-scroll
    class="listview"
    :data="data"
    ref="scrollRef"
    :probe-type="probeType"
    :listen-scroll="true"
    @scroll="handleScroll"
  >
    <ul ref="listGroupRef">
      <li class="list-group" v-for="group of data" :key="group.title">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item of group.items"
            :key="item.id"
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
    <div class="list-fixed" ref="fixed" v-show="fixedTitleRef">
      <div class="fixed-title">{{ fixedTitleRef }}</div>
    </div>
  </m-scroll>
</template>

<script>
import { ref, computed, watch } from 'vue'
import MScroll from '@components/m-scroll/index'
import { getDomData } from '@/utils/dom'

const LETTER_HEIGHT = 18

export default {
  name: 'MListview',
  components: {
    MScroll
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
    const currentIndexRef = ref(0)
    const scrollYRef = ref(0)
    const listGroupRef = ref(null)
    let liListGroup = null
    const scrollRef = ref(null)
    let heightList = []
    const touchObj = {}
    const probeType = 3

    const lettersRef = computed(() =>
      props.data.map(v => {
        return v.title.substr(0, 1)
      })
    )

    const fixedTitleRef = computed(() => {
      if (scrollYRef.value > 0) {
        return ''
      }
      return props.data[currentIndexRef.value]
        ? props.data[currentIndexRef.value].title
        : ''
    })

    watch(
      () => props.data,
      () => {
        setTimeout(() => {
          _getHeightList()
        }, 20)
      }
    )
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
        const left = heightList[i],
          right = heightList[i + 1]
        if (-y >= left && -y < right) {
          currentIndexRef.value = i
          return
        }
      }
      // 当滚动到最后 大于最后一个值的上限 -1 是下限
      currentIndexRef.value = heightList.length - 2
    })

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
    function _getHeightList() {
      heightList = []
      let height = 0
      heightList.push(height)
      liListGroup = listGroupRef.value.children
      for (const v of liListGroup) {
        height += v.clientHeight
        heightList.push(height)
      }
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
      scrollRef.value.scrollToElem(liListGroup[index])
    }
    return {
      currentIndexRef,
      lettersRef,
      listGroupRef,
      scrollRef,
      fixedTitleRef,
      probeType,
      handleLetterTouchStart,
      handleLetterTouchMove,
      handleScroll
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable'

.listview
  position fixed
  width 100%
  top 88px
  bottom 0
  overflow hidden
  background-color $color-e-ll
  .list-group
    padding-bottom: 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-n
      background-color $color-ef-ll
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
    background-color $color-ef-ll
    .fixed-title
      height 30px
      line-height 30px
      padding-left: 20px
      font-size $font-size-small
      color $color-text-n
</style>
