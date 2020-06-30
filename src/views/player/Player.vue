<template>
  <div class="player" v-show="playList">
    <div class="normal-player" v-show="fullScreen">播放器</div>
    <div class="mini-player" v-show="!fullScreen"></div>
  </div>
</template>

<script>
// import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Player',
  setup() {
    const store = useStore()
    const { fullScreen, playList } = store.state.singerModule
    // computed()
    console.log(store, fullScreen, playList)
    return {
      fullScreen,
      playList
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable.styl'
@import '~@styles/mixin.styl'

  .player
    .normal-player
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 150
      background-color $color-e-ll
</style>
