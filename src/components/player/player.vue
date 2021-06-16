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
      <div
        class="middle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="middle-l" :style="middleLStyle">
          <div class="cd-wrapper">
            <div ref="cdRef" class="cd">
              <img
                ref="cdImgRef"
                class="image"
                :class="cdCls"
                :src="currentSong.pic"
              />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <music-scroll
          ref="lyricScrollRef"
          class="middle-r"
          :style="middleRStyle"
        >
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                v-for="(line, index) of currentLyric.lines"
                :key="line.num"
                class="text"
                :class="{ current: currentLineNum === index }"
              >
                {{ line.txt }}
              </p>
            </div>
            <div v-show="pureMusicLyric" class="pure-music">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </music-scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
          <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              ref="barRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
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
      @ended="end"
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
import { PLAY_MODE } from '@/assets/js/constant'
import useCd from '@/components/player/use-cd'
import useLyric from '@/components/player/use-lyric'
import useMiddleInteractive from '@/components/player/use-middle-interactive'

export default {
  name: 'player',
  components: {
    ProgressBar
  },
  setup() {
    // data
    let progressChanging = false
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
    const playMode = computed(() => store.state.playMode)
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
      // 判断歌曲合法
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
    // 监听点击暂停，更改音乐播放
    watch(playing, newPlaying => {
      // fix: 问题播放器还没有准备就绪就直接播放的问题
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })
    // hooks
    // 切换播放模式
    const { iconMode, changeMode } = useMode()
    // 收藏歌曲
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdRef, cdImgRef, cdCls } = useCd()
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      canLyricScroll,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    } = useMiddleInteractive()
    const {
      lyricScrollRef,
      lyricListRef,
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      playLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime,
      canLyricScroll
    })
    // function
    function goBack() {
      store.commit('setFullScreen', false)
    }
    // 切换播放器播放状态
    function togglePlay() {
      // 如果播放器还没准备好
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingStatus', !playing.value)
    }
    // 上一首歌曲
    function prev() {
      const list = playList.value
      // 如果播放器还没准备好或者没有歌曲
      if (!songReady.value || !list.length) {
        return
      }
      // 如果播放列表只有一首歌就循环播放
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
        audioRef.value.play()
        store.commit('setPlayingStatus', true)
      }
    }
    // 下一首歌曲
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
        audioRef.value.play()
        store.commit('setPlayingStatus', true)
      }
    }
    // 循环播放
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingStatus', true)
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
      // 如果歌曲先于歌词准备完毕，需要等歌词准备完毕才能播放歌词
      playLyric()
    }
    // 播放器异常捕获
    // 歌曲无法播放的话需要将标签设置为 true，否则无法切换歌曲
    function error() {
      songReady.value = true
    }
    // 更新播放时间
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }
    // 移动进度条监听事件，只更改显示的当前播放时间
    function onProgressChanging(progress) {
      progressChanging = true
      currentTime.value = progress * currentSong.value.duration
      // 拖动时歌词要滚动到对应位置，但是不能自动滚动
      // 所以先用 playLyric 将歌词定位到对应位置，再用 stopLyric 暂停歌词
      playLyric()
      stopLyric()
    }
    // 移动进度条结束监听事件
    function onProgressChanged(progress) {
      progressChanging = false
      // 将播放时间赋值给 audio 元素 更改歌曲播放时间
      audioRef.value.currentTime = currentTime.value =
        progress * currentSong.value.duration
      if (!playing.value) {
        store.commit('setPlayingStatus', true)
      }
      // 拖动进度条结束后，在当前位置播放歌词
      playLyric()
    }
    // audio 播放完毕后的触发事件，除此之外，还会自动调用 pause 事件
    function end() {
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
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
      end,
      onProgressChanging,
      onProgressChanged,
      // useMode
      iconMode,
      changeMode,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite,
      // useCd
      cdRef,
      cdImgRef,
      cdCls,
      // useLyric
      lyricScrollRef,
      lyricListRef,
      currentLyric,
      currentLineNum,
      playingLyric,
      pureMusicLyric,
      // useMiddleInteractive
      currentShow,
      middleLStyle,
      middleRStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd
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
