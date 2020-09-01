<template>
  <div class="progress-bar" ref="progressBar">
    <div class="inner-wrapper">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
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
  setup(props) {
    const { progressBar, progress, progressBtn } = useComputeDom(props)
    return { progressBar, progress, progressBtn }
  }
}

function useComputeDom(props) {
  const progressBar = ref(null),
    progress = ref(null),
    progressBtn = ref(null)

  // 模板引用 ref 会在渲染之后将 dom 赋值给 ref，
  // 而 setup 相当于 created 生命周期，所以不能直接在 setup 里面
  // 通过 ref 获取 dom
  onMounted(() => {
    console.log(progressBar.value)
  })
  // props 是一个 reactive 类型的值，props 下的值都不是引用类型。所以watch 的时候要么 watch 整个 props 要么 对 props 下的值 做一层引用
  // const percent = ref(props.percent) 这种方式不行
  watch(
    () => props.percent, // 目前只尝试出这种方法
    newPercent => {
      const barWidth = progressBar.value.clientWidth - progressBtnWidth
      const offsetWidth = barWidth * newPercent
      progress.value.style.width = `${offsetWidth}px`
      progressBtn.value.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  )

  return {
    progressBar,
    progress,
    progressBtn
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
