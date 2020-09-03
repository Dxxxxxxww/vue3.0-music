<template>
  <div class="progress-bar" ref="progressBar">
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
import { ref, watch, onMounted } from 'vue'
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
    const {
      progressBar,
      progress,
      progressBtn,
      progressStart,
      progressMove,
      progressEnd
    } = useComputeDom(props, context)

    return {
      progressBar,
      progress,
      progressBtn,
      progressStart,
      progressMove,
      progressEnd
    }
  }
}
/**
 * @description 根据歌曲进度百分比计算进度条
 */
function useComputeDom(props, context) {
  const progressBar = ref(null),
    progress = ref(null),
    progressBtn = ref(null)

  const {
    touch,
    progressStart,
    progressMove,
    progressEnd
  } = useControlProgress(context, progressBar, progress, progressBtn)
  // 模板引用 ref 会在渲染之后将 dom 赋值给 ref，
  // 而 setup 相当于 created 生命周期，所以不能直接在 setup 里面
  // 通过 ref 获取 dom
  onMounted(() => {
    console.log(progressBar.value)
  })
  // props 是一个 reactive 类型的值，props 下的值都不是引用类型。所以 watch 的时候要么 watch 整个 props 要么 对 props 下的值 做一层引用
  // const percent = ref(props.percent) 这种方式不行
  watch(
    () => props.percent, // 目前只尝试出这种方法
    newPercent => {
      if (newPercent >= 0 && !touch.flag) {
        const barWidth = progressBar.value.clientWidth - progressBtnWidth
        const offsetWidth = barWidth * newPercent
        _offset(progress, progressBtn, offsetWidth)
      }
    }
  )

  return {
    progressBar,
    progress,
    progressBtn,
    progressStart,
    progressMove,
    progressEnd
  }
}
/**
 * @description 控制进度条进度
 */
function useControlProgress(context, progressBar, progress, progressBtn) {
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
    // touch.percent = offsetWidth / touch.barWidth 这里可以通过缓存 percent ，在 end 事件里直接提交
    // 但是为了点击进度条的代码复用，就不这样写
    _offset(progress, progressBtn, offsetWidth)
  }

  function progressEnd(e) {
    touch.flag = false
    _triggerPercent(context, _getPercent())
  }

  function _getPercent() {
    const barWidth = progressBar.value.clientWidth - progressBtnWidth,
      offsetWidth = progress.value.clientWidth
    return offsetWidth / barWidth
  }

  return {
    touch,
    progressStart,
    progressMove,
    progressEnd
  }
}

function _offset(progress, progressBtn, offsetWidth) {
  progress.value.style.width = `${offsetWidth}px`
  progressBtn.value.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
}

function _triggerPercent(context, percent) {
  context.emit('percent-change', percent)
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
