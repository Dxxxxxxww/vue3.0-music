<template>
  <div>
    <button type="button" @click="handleToggle">toggle</button>
    <!-- v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave" -->
    <transition name="fade">
      <div class="test" v-show="showRef"></div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Test',
  data() {
    return {}
  },
  setup() {
    const showRef = ref(false)
    const handleToggle = () => {
      showRef.value = !showRef.value
    }

    // const beforeEnter = el => {
    //   el.style.opacity = 0
    //   el.style.transformOrigin = 'left'
    // }
    // const enter = (el, done) => {
    //   el.style = "opacity: 1; fontSize: '1.4em';transition: all .3s ease "
    //   console.log(arguments) // done == null
    // }
    // const beforeLeave = el => {
    //   el.style = "opacity: 1; fontSize: '1.4em';transition: all .3s ease "
    // }
    // const leave = (el, done) => {
    //   el.style.opacity = 0
    //   el.style.transformOrigin = 'left'
    // }

    return {
      showRef,
      handleToggle
      // beforeEnter,
      // enter,
      // beforeLeave,
      // leave
    }
  }
}
</script>

<style scoped lang="stylus">
.fade-enter-active {
  transition: all .3s ease;
}
.fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.fade-enter-to, .fade-leave {
  transform: translateX(0);
  opacity: 1;
}
.test
  width 100px
  height 100px
  background-color red
</style>
