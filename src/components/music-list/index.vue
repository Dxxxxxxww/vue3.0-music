<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      class="bg-image"
      :style="{ backgroundImage: bgStyleRef }"
      ref="bgImageRef"
    >
      <div class="play-wrapper">
        <div ref="playBtn" v-show="showPlayBtnRef" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filterRef"></div>
    </div>
    <div class="bg-layer" ref="layerRef"></div>
    <m-scroll
      :data="songs"
      class="list"
      ref="listRef"
      :probeType="probeType"
      :listenScroll="true"
      @scroll="handleScroll"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </m-scroll>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { prefixStyle } from '@/utils/dom.js'
import MScroll from '@/components/m-scroll/index.vue'
import SongList from '@/components/song-list/index.vue'
import Loading from '@/components/loading/loading.vue'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdropFilter = prefixStyle('backdropFilter')

export default {
  name: 'MusicList',
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
    const bgImageRef = ref(null)
    const layerRef = ref(null)
    const probeType = 3
    let minTransalteY = 0
    const scrollTopEnd = ref(true)
    const scrollY = ref(0)
    const bgStyleRef = computed(() => `url(${props.bgImage})`)
    const showPlayBtnRef = computed(
      () => !!props.songs.length && scrollTopEnd.value
    )
    const filterRef = ref(null)

    watch(scrollY, (cur, pre) => {
      // 这里可以用 Math.max 学到了，如果识我就会 if 判断是否执行 transform 赋值
      const translateY = Math.max(cur, minTransalteY)
      layerRef.value.style[transform] = `translate3d(0, ${translateY}px, 0)`

      let zIndex = 0,
        scale = 1,
        blur = 0
      const percent = Math.abs(cur / bgImageRef.value.clientHeight)
      if (cur > 0) {
        zIndex = 10
        scale = 1 + percent
      } else {
        blur = Math.min(20 * percent, 20)
      }

      // 这个属性只有 iOS 设备才有，安卓可以使用 filter 来实现高斯模糊(毛玻璃)
      filterRef.value.style[backdropFilter] = `blur(${blur}px)`
      // 这个属性在浏览器上还是得加上这一句，不然就失效了
      filterRef.value.style.backdropFilter = `blur(${blur}px)`

      if (cur < minTransalteY) {
        scrollTopEnd.value = false
        zIndex = 10
        bgImageRef.value.style.height = RESERVED_HEIGHT + 'px'
        bgImageRef.value.style.paddingBottom = 0
      } else {
        scrollTopEnd.value = true
        bgImageRef.value.style.height = 0
        bgImageRef.value.style.paddingBottom = '70%'
      }
      // 操作写在一起比较方便看和改
      bgImageRef.value.style.transform = `scale(${scale})`
      bgImageRef.value.style.zIndex = zIndex
    })

    const listRef = ref(null)
    onMounted(() => {
      listRef.value.$el.style.top = `${bgImageRef.value.clientHeight}px`
      minTransalteY = -bgImageRef.value.clientHeight + RESERVED_HEIGHT
    })

    function handleScroll(pos) {
      scrollY.value = pos.y
      // layerRef.value.style.transform = `translate3d(0, ${pos.y}px, 0)`
    }

    function back() {
      this.$router.back()
    }

    const store = useStore()
    function selectItem({ item, index }) {
      store.dispatch('singerModule/selectPlay', { songs: props.songs, index })
      console.log(item, index)
    }

    return {
      bgStyleRef,
      listRef,
      bgImageRef,
      layerRef,
      showPlayBtnRef,
      probeType,
      filterRef,
      handleScroll,
      back,
      selectItem
    }
  },
  components: {
    MScroll,
    SongList,
    Loading
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
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-e-ll
  .list
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background: $color-e-ll
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
