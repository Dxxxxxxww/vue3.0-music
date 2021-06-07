<template>
  <div class="player">
    <div v-show="fullScreen" class="normal-player">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar ref="barRef" :progress="progress"></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="iconMode" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disabledClass">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disabledClass">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disabledClass">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar'
import { formatTime } from '@/assets/js/util'
// import Scroll from '@/components/base/scroll/music-scroll'

export default {
  name: 'player',
  components: {
    // Scroll
    ProgressBar
  },
  setup() {
    // data
    const audioRef = ref(null)
    // 播放器是否准备就绪标签
    const songReady = ref(false)
    const currentTime = ref(0)
    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playList = computed(() => store.state.playList)
    const currentIndex = computed(() => store.state.currentIndex)
    // computed
    // 通过判断播放器是否准备就绪来切换样式
    const disabledClass = computed(() => (songReady.value ? '' : 'disable'))
    const playIcon = computed(() =>
      playing.value ? 'icon-pause' : 'icon-play'
    )
    const progress = computed(
      () => currentTime.value / currentSong.value.duration
    )
    // watch
    // 监听歌曲变化
    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) {
        return
      }
      // 歌曲变动后重置标签
      songReady.value = false
      currentTime.value = 0
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    // 监听点击暂停取消，更改音乐播放
    watch(playing, newPlaying => {
      // fix: 问题播放器还没有准备就绪就直接播放的问题
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })
    // hooks
    const { iconMode, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    // function
    function goBack() {
      store.commit('setFullScreen', false)
    }

    function togglePlay() {
      // 如果播放器还没准备好
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingStatus', !playing.value)
    }

    function prev() {
      const list = playList.value
      // 如果播放器还没准备好或者没有歌曲
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
        return
      }
      let index = currentIndex.value - 1
      if (index === -1) {
        index = list.length - 1
      }
      store.commit('setCurrentIndex', index)
      if (!playing.value) {
        const audioEl = audioRef.value
        audioEl.play()
        store.commit('setPlayingStatus', true)
      }
    }

    function next() {
      const list = playList.value
      // 如果播放器还没准备好或者没有歌曲
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
        return
      }
      let index = currentIndex.value + 1
      if (index === list.length) {
        index = 0
      }
      store.commit('setCurrentIndex', index)
      if (!playing.value) {
        const audioEl = audioRef.value
        audioEl.play()
        store.commit('setPlayingStatus', true)
      }
    }
    // 循环播放
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
    }
    // event
    // 手机关机等额外因素导致音乐暂停时需要更改数据
    function pause() {
      store.commit('setPlayingStatus', false)
    }
    // 播放器准备就绪时的回调
    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }
    // 播放器异常捕获
    // 歌曲无法播放的话需要将标签设置为 true，否则无法切换歌曲
    function error() {
      songReady.value = true
    }
    // 更新播放时间
    function updateTime(e) {
      currentTime.value = e.target.currentTime
    }

    return {
      // tools
      formatTime,
      // ref
      audioRef,
      // data
      currentTime,
      // computed
      fullScreen,
      currentSong,
      playIcon,
      disabledClass,
      progress,
      // function
      goBack,
      togglePlay,
      prev,
      next,
      // event
      pause,
      ready,
      error,
      updateTime,
      // useMode
      iconMode,
      changeMode,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
