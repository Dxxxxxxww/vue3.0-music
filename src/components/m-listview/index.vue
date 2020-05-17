<template>
  <m-scroll
    class="listview"
    :data="data"
    ref="scroll"
    :probe-type="probeType"
    :listen-scroll="true"
    @scroll="handleScroll"
  >
    <ul>
      <li
        class="list-group"
        v-for="group of data"
        :key="group.title"
        ref="listGroup"
      >
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
      class="list-letters"
      @touchstart.stop.prevent="handleLetterTouchStart"
      @touchmove.stop.prevent="handleLetterTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          class="letter"
          v-for="(item, index) of letters"
          :key="item"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </m-scroll>
</template>

<script>
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
  data() {
    return {
      currentIndex: 0,
      scrollY: 0
    }
  },
  computed: {
    letters() {
      return this.data.map(v => {
        return v.title.substr(0, 1)
      })
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._getHeightList()
      }, 20)
    },
    scrollY(nv) {
      const y = nv
      if (y > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0, len = this.heightList.length; i < len; i++) {
        const left = this.heightList[i],
          right = this.heightList[i + 1]
        if (-y >= left && -y < right) {
          this.currentIndex = i
          return
        }
      }
      // 大于最后一个值的上限 -1 是下限
      this.currentIndex = this.heightList.length - 2
    }
  },
  created() {
    this.touch = {}
    this.probeType = 3
  },
  methods: {
    handleLetterTouchStart(e) {
      const touch = e.touches[0]
      const index = getDomData(e.target, 'index')
      this.touch.y1 = touch.pageY
      this.touch.startIndex = parseInt(index)
      this._scrollTo(index)
    },
    handleLetterTouchMove(e) {
      const touch = e.touches[0]
      this.touch.y2 = touch.pageY
      const moveIndex = ((this.touch.y2 - this.touch.y1) / LETTER_HEIGHT) | 0
      this._scrollTo(this.touch.startIndex + moveIndex)
    },
    // 使用函数方式，也可以使用 watch
    // handleScroll({ y }) {
    //   if (y > 0) {
    //     this.currentIndex = 0
    //     return
    //   }
    //   for (let i = 0, len = this.heightList.length; i < len; i++) {
    //     const left = this.heightList[i],
    //       right = this.heightList[i + 1]

    //     if (-y >= left && -y < right) {
    //       this.currentIndex = i
    //       return
    //     }
    //   }
    //   // 大于最后一个值的上限 -1 是下限
    //   this.currentIndex = this.heightList.length - 2
    // },
    handleScroll({ y }) {
      this.scrollY = y
    },
    _getHeightList() {
      this.heightList = []
      let height = 0
      this.heightList.push(height)
      for (const v of this.$refs.listGroup) {
        height += v.clientHeight
        this.heightList.push(height)
      }
    },
    _scrollTo(index) {
      this.$refs.scroll.scrollToElem(this.$refs.listGroup[index])
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
  .list-letters
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
    .current
      color red
</style>
