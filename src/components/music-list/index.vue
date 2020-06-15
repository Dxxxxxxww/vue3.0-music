<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      class="bg-image"
      :style="{ backgroundImage: bgStyleRef }"
      ref="bgImage"
    >
      <div class="play-wrapper">
        <div
          ref="playBtn"
          v-show="songs.length > 0"
          class="play"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- <m-scroll></m-scroll> -->
  </div>
</template>

<script>
import { computed } from 'vue'
// import MScroll from '@/components/m-scroll/index.vue'

export default {
  name: 'MusicList',
  components: {
    // MScroll
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const bgStyleRef = computed(() => `url(${props.bgImage})`)
    console.log(bgStyleRef.value)
    return { bgStyleRef }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable'
@import '~@styles/mixin'

.music-list
  position fixed
  z-index 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background-color $color-w
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-text-highlight
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-text-highlight
  .bg-image
    position relative
    width 100%
    height 0
    padding-bottom 70%
    transform-origin top
    background-size cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-text-highlight
        color $color-text-highlight
        border-radius  100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small

// .slide-enter-active, .slide-leave-active
//   transition: all 0.3s

// .slide-enter, .slide-leave-to
//   transform: translate3d(100%, 0, 0)
</style>
