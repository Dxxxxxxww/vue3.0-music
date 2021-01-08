<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="inner-wrapper">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressStart"
        @touchmove.prevent="progressMove"
        @touchend.prevent="progressEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { prefixStyle } from '@/utils/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  name: 'ProgressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const progressBar = ref(null),
      progress = ref(null),
      progressBtn = ref(null),
      store = useStore()
    // let progressBarWidth = 0

    // 模板引用 ref 会在渲染之后将 dom 赋值给 ref，
    // 而 setup 相当于 created 生命周期，所以不能直接在 setup 里面
    // 通过 ref 获取 dom
    onMounted(() => {
      console.log(progressBar.value, context)
    })
    // 因为 Payer 组件是直接挂载在 App.vue 上的 所以不能在 onMounted
    // 生命周期中调用来解决。
    // 只能通过监听 Player 组件是否全屏的方式来保证滚动条的滚动是正常的。
    // 直接通过 store 获取会让 progress 组件与 Player 的全屏状态产生
    // 强耦合，更好的方式是通过 props 传递。 这里懒得改了
    const fullScreen = computed(() => store.state.musicModule.fullScreen)

    // **--||如果想要在后台也一直修改 progress 的状态，来保证
    // 切换到全屏时候的进度条是平滑的，而不是出现跳跃的情况
    // 就需要将总长度缓存下来
    // watch(fullScreen, newValue => {
    //   if (newValue) {
    //     progressBarWidth = progressBar.value.clientWidth
    //   }
    // })

    // props 是一个 reactive 类型的值，props 下的值都不是引用类型。所以 watch 的时候要么 watch 整个 props 要么 对 props 下的值 做一层引用
    // const percent = ref(props.percent) 这种方式不行
    watch(
      () => props.percent, // 目前只尝试出这种方法
      newPercent => {
        // 1. 解决 progressBtn 在 mini 时播放一段时间再暂停，切换到全屏时
        // 的 transform 的问题
        // 2. 优化，当非全屏状态下，不修改 style
        // **--|| progressBarWidth 下面的判断条件里去除 fullScreen.value
        // 并使用 progressBarWidth 来代替 progressBar.value.clientWidth
        if (newPercent >= 0 && !touch.flag && fullScreen.value) {
          const barWidth = progressBar.value.clientWidth - progressBtnWidth
          if (barWidth) {
            const offsetWidth = barWidth * newPercent
            _offset(offsetWidth)
          }
        }
      }
    )

    /* eslint-disable */
    const touch = {}

    function progressStart(e) {
      touch.flag = true
      // 总长
      touch.barWidth = progressBar.value.clientWidth - progressBtnWidth
      // 初始宽度
      touch.left = progress.value.clientWidth
      // 起点
      touch.startX = e.touches[0].pageX
    }

    function progressMove(e) {
      // 偏移量
      let offsetWidth = e.touches[0].pageX - touch.startX
      // 偏移量 + 初始宽度 = 当前宽度 不能小于 0 不能大于最大长度
      offsetWidth = Math.min(
        touch.barWidth,
        Math.max(0, offsetWidth + touch.left)
      )
      // touch.percent = offsetWidth / touch.barWidth 这里可以通过缓存 percent ，在 progressEnd 事件里直接提交
      // 但是为了点击进度条的代码复用，就不这样写
      _offset(offsetWidth)
    }

    function progressEnd(e) {
      touch.flag = false
      _triggerPercent()
    }

    function progressClick(e) {
      // 这里不使用 e.offsetX 是为了解决当点击到 progressBtn
      // 时出现的偏移量计算不正确的问题
      // 所以使用 e.pageX 再通过 getBoundingClientRect 获取 progressBar
      // 到页面的距离，相减就行了。
      const rect = progressBar.value.getBoundingClientRect()
      _offset(e.pageX - rect.left)
      _triggerPercent()
    }

    function _getPercent() {
      const barWidth = progressBar.value.clientWidth - progressBtnWidth,
        offsetWidth = progress.value.clientWidth
      return offsetWidth / barWidth
    }

    function _offset(offsetWidth) {
      progress.value.style.width = `${offsetWidth}px`
      progressBtn.value.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }

    function _triggerPercent() {
      context.emit('percent-change', _getPercent())
    }

    return {
      progressBar,
      progress,
      progressBtn,
      progressStart,
      progressMove,
      progressEnd,
      progressClick
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable.styl'

.progress-bar
  height 30px
  .inner-wrapper
    position relative
    top 13px
    height 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background-color $color-background-ll
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text-l
        border-radius: 50%
        background: $color-background-ll
</style>
