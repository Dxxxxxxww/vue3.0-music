<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div class="progress-btn-wrapper" :style="btnStyle">
        <div
          class="progress-btn"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from 'vue'

const BTN_WIDTH = 16

export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-changed'],
  setup(props, { emit }) {
    // const
    const instance = getCurrentInstance()
    // data
    const offset = ref(0)
    const barWidth = ref(0)
    const touch = ref({})
    const progressRef = ref(null)
    // computed
    const progressStyle = computed(() => `width: ${offset.value}px`)
    const btnStyle = computed(
      () => `transform: translate3d(${offset.value}px, 0, 0)`
    )
    // watch
    watch(
      () => props.progress,
      newProgress => {
        // this.$el.clientWidth： 在 2.x 里如果需要获取组件根元素可以使用 this.$el，
        // 在 3.x 中可以使用 getCurrentInstance，
        // 对于使用了片段(多根组件)的组件，$el 是占位 DOM 节点，
        // Vue 使用它来跟踪组件在 DOM 中的位置。建议使用模板引用（ref）来直接访问 DOM 元素，而不是依赖于 $el
        // barWidth 只计算一次就可以了
        if (!barWidth.value || barWidth.value < 0) {
          barWidth.value = instance.ctx.$el.clientWidth - BTN_WIDTH
        }
        offset.value = newProgress * barWidth.value
      }
    )
    // event
    // 进度条触摸开始事件，保存触摸位置
    function onTouchStart(e) {
      touch.value.x1 = e.touches[0].pageX
      touch.value.beginWidth = progressRef.value.clientWidth
    }
    // 进度条移动事件，改变进度条宽度，按钮偏移，歌曲播放时间
    function onTouchMove(e) {
      const delta = e.touches[0].pageX - touch.value.x1
      const tempWidth = delta + touch.value.beginWidth
      const progress = Math.min(1, Math.max(tempWidth / barWidth.value, 0))
      offset.value = progress * barWidth.value
      emit('progress-changing', progress)
    }
    // 结束进度条移动事件，松开触发移动结束，传出百分比
    function onTouchEnd(e) {
      const progress = progressRef.value.clientWidth / barWidth.value
      emit('progress-changed', progress)
    }
    // 点击进度条改变歌曲播放时间
    function onClick(e) {
      const rect = instance.ctx.$el.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const progress = offsetWidth / barWidth.value
      // 这里不需要改变 offset.value
      // 因为 progress-changed 会在 player 中更改 currentTime，
      // currentTime 的改变会引起 props.progress 的改变从而改变 offset.value
      console.log(e.pageX, rect.left, barWidth.value)
      emit('progress-changed', progress)
    }

    return {
      // data
      offset,
      progressRef,
      // computed
      progressStyle,
      btnStyle,
      // event
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
