<template>
  <div class="progress-circle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 100 100"
      :width="radius"
      :height="radius"
    >
      <circle
        class="progress-background"
        cx="50"
        cy="50"
        r="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        cx="50"
        cy="50"
        r="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const dashArray = ref(Math.PI * 50 * 2)
    const dashOffset = computed(() => (1 - props.percent) * dashArray.value)

    return {
      dashArray,
      dashOffset
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable.styl'

.progress-circle
  position: relative
  circle
    stroke-width 8px
    transform-origin: center
    &.progress-background
      stroke-width 5px
      transform: scale(0.9)
      stroke: $color-text
    &.progress-bar
      transform: scale(0.93) rotate(-90deg)
      stroke: $color-theme
</style>
