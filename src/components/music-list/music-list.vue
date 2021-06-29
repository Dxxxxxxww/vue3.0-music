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
    <Scroll
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      class="list"
      :style="scrollStyle"
      :probe-type="3"
      @scroll="onScroll"
    >
      <!--      v-no-result:[noResultText]="noResult"-->
      <div class="song-list-wrapper">
        <music-song-list
          :songs="songs"
          :rank="rank"
          @select="selectItem"
        ></music-song-list>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { useStyle } from './use-style'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import Scroll from '@/components/wrapper-scroll'

export default {
  name: 'music-list',
  components: {
    Scroll
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
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  setup(props) {
    const rank = ref(null)
    const router = useRouter()
    const store = useStore()
    const noResult = computed(() => {
      return !props.loading && !props.songs.length
    })
    const {
      bgImage,
      bgImageStyle,
      filterStyle,
      scrollStyle,
      playBtnStyle,
      onScroll
    } = useStyle(props)

    function goBack() {
      router.back()
    }
    function random() {
      store.dispatch('randomPlay', props.songs)
    }
    function selectItem({ song, index }) {
      store.dispatch('selectPlay', { list: props.songs, index })
    }

    return {
      rank,
      noResult,
      goBack,
      random,
      selectItem,
      // style
      bgImage,
      bgImageStyle,
      filterStyle,
      scrollStyle,
      playBtnStyle,
      onScroll
    }
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
