<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) of dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from '@/utils/dom'

export default {
  name: 'MSlider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  // 在 mounted 钩子里使用，确保 dom 已经渲染，bscroll 不报错
  mounted() {
    // 浏览器是17ms刷新一次，使用20ms比较科学
    setTimeout(() => {
      this.setSliderWidth()
      this.initSlider()
      this.initDots()

      if (this.autoPlay) {
        this.play()
      }
      this.registerResizeEvent()
    }, 20)
  },
  destroyed() {
    // 避免内存泄露
    clearTimeout(this.timer)
  },
  methods: {
    /**
     * @description 设置 slider 宽度
     */
    setSliderWidth(isResize = false) {
      // 首先获取所有的图片数量
      this.children = this.$refs.sliderGroup.children
      console.log(this.children.length)
      // 总宽度
      let width = 0
      // 最外层宽度
      const sliderWidth = this.$refs.slider.clientWidth
      for (const v of this.children) {
        addClass(v, 'slider-item')
        v.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 如果是可以循环，就需要加上两个克隆元素的宽度(一个的情况不能用在拖动图片，会穿帮，适合用在点击箭头的情况)
      // 增加 isResize 判断，避免在 resize 事件触发时一直在添加 width
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
        // 这里的 click 要去除，是因为 BScroll 点击，fastclick点击和原生点击冲突，导致移动端点击轮播图不能跳转网页，所以这里去掉点击功能，使用 a 标签本身的跳转
        // click: true
      })

      this.slider.on('scrollEnd', this.onScrollEnd)
    },
    initDots() {
      let length = this.children.length
      if (this.loop) {
        length -= 2
      }
      this.dots = new Array(length)
    },
    onScrollEnd() {
      const pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this.play()
      }
    },
    play() {
      // setTimeout来替代setInterval
      // setInterval缺陷：是因为假如cpu繁忙时，执行代码需要消耗大量时间，当第一次interval还没有执行完，而第二次interval已经在队列里排队了，这样的话当第一次执行完就会立刻执行第二次。
      // 红宝书： 在开发环境下，很少使用间歇调用（setInterval），原因是后一个间歇调用很可能在前一个间歇调用结束前启动”
      // setInterval间歇调用，是在前一个方法执行前，就开始计时，比如间歇时间是500ms，那么不管那时候前一个方法是否已经执行完毕，都会把后一个方法放入执行的序列中。这时候就会发生一个问题，假如前一个方法的执行时间超过500ms，加入是1000ms，那么就意味着，前一个方法执行结束后，后一个方法马上就会执行，因为此时间歇时间已经超过500ms了

      // 滚动前先清理一遍，防止自动滚动时掺杂手动滚动导致的bug
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    registerResizeEvent() {
      window.addEventListener('resize', () => {
        // 如果 slider 还未初始化，就啥也不做
        if (!this.slider) {
          return
        }
        this.setSliderWidth(true)
        this.slider.refresh()
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable.styl'

.slider
  min-height 1px
  .slider-group
    position relative
    overflow hidden
    white-space nowrap
    .slider-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
      a
        display block
        width 100%
        overflow hidden
        text-decoration none
        img
          width 100%
  .dots
    position absolute
    left 0
    right 0
    bottom 12px
    transform translateZ(1px)
    text-align center
    font-size 0
    .dot
      display inline-block
      width 8px
      height 8px
      margin 0 4px
      border-radius 50%
      background-color $color-background-l
      &.active
        width 20px
        border-radius 5px
        background-color $color-background-ll
</style>
