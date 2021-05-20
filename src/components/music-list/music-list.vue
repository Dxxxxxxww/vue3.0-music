<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
    >
      <!--      v-no-result:[noResultText]="noResult"-->
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'

const RESERVED_HEIGHT = 40

export default {
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    loading: Boolean
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0
    }
  },
  computed: {
    bgImageStyle() {
      const scrollY = this.scrollY
      let height = 0,
        paddingBottom = '70%',
        zIndex = 0,
        scale = 1,
        // 兼容 ios 移动端问题
        translateZ = 0
      // 当大于最大距离时，就说明需要留出头部位置了
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingBottom = '0'
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // 向下滑
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.maxTranslateY)
      }

      return {
        zIndex,
        paddingBottom,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    playBtnStyle() {
      return ''
    },
    // 图片模糊层处理
    filterStyle() {
      let blur = 0
      const imageHeight = this.imageHeight,
        scrollY = this.scrollY,
        multiple = 20
      // 向上滑动时
      if (scrollY >= 0) {
        // blur 的最大值是 最大向上滑动距离 / 图片高度
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) *
          multiple
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`
      }
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
  },
  methods: {
    onScroll(pos) {
      this.scrollY = -pos.y
      // 歌词列表向上滚动的最大距离
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    goBack() {
      this.$router.back()
    },
    random() {}
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
