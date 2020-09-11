<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img class="img" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" alt="" class="image" />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                class="progress-bar"
                :percent="percent"
                @percent-change="percentChange"
              />
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="playModeIconClass" @click="changePlayMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img class="img" :class="cdCls" :src="currentSong.image" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="32" :percent="percent">
            <i class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audioRef"
      :src="currentSong.url"
      @playing="ready"
      @timeupdate="updateTime"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '@/utils/dom'
import { shuffle } from '@/utils/utils'
import { format } from '@/utils/format'
import { playMode } from '@/config/config'
import ProgressBar from '@components/progress-bar'
import ProgressCircle from '@components/progress-circle/ProgressCircle'

const transform = prefixStyle('transform')
const { sequence, loop, random } = playMode

export default {
  name: 'Player',
  components: { ProgressBar, ProgressCircle },
  setup(props, context) {
    const store = useStore()
    const playList = computed(() => store.state.singerModule.playList)

    const { back, open, fullScreen } = useTogglePlayerFullScreen(store)

    const { enter, afterEnter, leave, afterLeave, cdWrapper } = useAnimation()

    const {
      audioRef,
      currentSong,
      playIcon,
      miniIcon,
      cdCls,
      togglePlaying,
      nextSong,
      prevSong,
      ready,
      error,
      disableCls,
      percentChange,
      playModeIconClass,
      changePlayMode
    } = usePlayMusic(store)

    const { currentTime, updateTime } = useDuration()

    const percent = computed(
      () => currentTime.value / currentSong.value.duration
    )

    return {
      fullScreen,
      playList,
      currentSong,
      back,
      open,
      enter,
      afterEnter,
      leave,
      afterLeave,
      cdWrapper,
      audioRef,
      playIcon,
      miniIcon,
      cdCls,
      togglePlaying,
      nextSong,
      prevSong,
      ready,
      error,
      disableCls,
      currentTime,
      updateTime,
      format,
      percent,
      percentChange,
      playModeIconClass,
      changePlayMode
    }
  }
}

function useAnimation() {
  const { x, y, scale } = _getPosAndScale()
  const cdWrapper = ref(null)

  function enter(el, done) {
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: 'translate3d(0,0,0) scale(1.1)'
      },
      100: {
        transform: 'translate3d(0,0,0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: '400',
        easing: 'linear'
      }
    })
    // done is undefined vue3 bug？
    animations.runAnimation(cdWrapper.value, 'move', done)
  }
  function afterEnter() {
    animations.unregisterAnimation('move')
    cdWrapper.value.style.animation = ''
  }
  function leave(el, done) {
    cdWrapper.value.style.transition = 'all .4s'
    cdWrapper.value.style[
      transform
    ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    const timeout = setTimeout(done, 400)
    // done is undefined vue3 bug？
    cdWrapper.value.addEventListener('transitionend', () => {
      clearTimeout(timeout)
      done && done()
    })
  }
  function afterLeave() {
    cdWrapper.value.style.transition = ''
    cdWrapper.value.style[transform] = ''
  }

  return {
    enter,
    afterEnter,
    leave,
    afterLeave,
    cdWrapper
  }
}

/**
 * @description 切换播放器全屏/缩小状态
 */
function useTogglePlayerFullScreen(store) {
  const fullScreen = computed(() => store.state.singerModule.fullScreen)

  function back() {
    store.commit('singerModule/setFullScreen', false)
  }

  function open() {
    store.commit('singerModule/setFullScreen', true)
  }

  return {
    back,
    open,
    fullScreen
  }
}

function usePlayMusic(store) {
  const audioRef = ref(null)
  const currentSong = computed(() => store.getters['singerModule/currentSong'])
  const playing = computed(() => store.getters['singerModule/playing'])
  const playIcon = computed(() => (playing.value ? 'icon-pause' : 'icon-play'))
  const miniIcon = computed(() =>
    playing.value ? 'icon-pause-mini' : 'icon-play-mini'
  )

  const cdCls = computed(() => (playing.value ? 'play' : 'play pause'))

  watch(currentSong, (newSong, oldSong) => {
    if (newSong.id === oldSong.id) {
      return
    }
    setTimeout(() => {
      audioRef.value.play()
    }, 0)
  })

  watch(playing, newPlaying => {
    setTimeout(() => {
      newPlaying ? audioRef.value.play() : audioRef.value.pause()
    }, 0)
  })

  const songReady = ref(true)
  const disableCls = computed(() => (songReady.value ? '' : 'disable'))
  function togglePlaying() {
    if (!songReady.value) {
      return
    }
    store.commit('singerModule/setPlaying', !playing.value)
  }

  const currentIndex = computed(
    () => store.getters['singerModule/currentIndex']
  )
  const playList = computed(() => store.getters['singerModule/playList'])
  const sequenceList = computed(
    () => store.getters['singerModule/sequenceList']
  )

  function nextSong() {
    if (!songReady.value) {
      return
    }
    let index = currentIndex.value + 1
    if (index === playList.value.length) {
      index = 0
    }
    store.commit('singerModule/setCurrentIndex', index)
    // 暂停情况下切歌，改成播放状态
    if (!playing.value) {
      togglePlaying()
    }
    songReady.value = false
  }

  function prevSong() {
    if (!songReady.value) {
      return
    }
    let index = currentIndex.value - 1
    if (index === -1) {
      index = playList.value.length - 1
    }
    store.commit('singerModule/setCurrentIndex', index)
    // 暂停情况下切歌，改成播放状态
    if (!playing.value) {
      togglePlaying()
    }
    songReady.value = false
  }

  const playMode = computed(() => store.getters['singerModule/playMode'])
  const playModeIconClass = computed(() =>
    playMode.value === sequence
      ? 'icon-sequence'
      : playMode.value === loop
        ? 'icon-loop'
        : playMode.value === random
          ? 'icon-random'
          : ''
  )

  function changePlayMode() {
    const mode = (playMode.value + 1) % 3
    store.commit('singerModule/setPlayMode', mode)
    let list = []
    if (playMode.value === random) {
      list = shuffle(playList.value)
    } else {
      list = sequenceList.value
    }
    const index = resetCurrentIndex(list)
    // 切换歌曲播放模式后，播放列表就变了，但是由于 index 是老的 index，
    // 就会导致 歌曲变了，所以需要通过歌曲 id 来找到播放列表变化后的对应 index
    store.commit('singerModule/setCurrentIndex', index)
    store.commit('singerModule/setPlayList', list)
  }
  function resetCurrentIndex(list) {
    return list.findIndex(item => item.id === currentSong.value.id)
  }

  function percentChange(percent) {
    audioRef.value.currentTime = currentSong.value.duration * percent
    if (!playing.value) {
      togglePlaying()
    }
  }

  function ready() {
    songReady.value = true
  }

  function error() {
    songReady.value = true
  }

  return {
    audioRef,
    currentSong,
    playIcon,
    miniIcon,
    cdCls,
    togglePlaying,
    nextSong,
    prevSong,
    ready,
    error,
    disableCls,
    percentChange,
    playModeIconClass,
    changePlayMode
  }
}

function useDuration() {
  const currentTime = ref(0)

  function updateTime(e) {
    currentTime.value = e.target.currentTime
  }

  return {
    currentTime,
    updateTime
  }
}

function _getPosAndScale() {
  const targetWidth = 40
  const paddingLeft = 20
  const paddingBottom = 10
  const paddingTop = 40
  const width = window.innerWidth * 0.8
  const scale = targetWidth / width
  const x = -(window.innerWidth / 2 - paddingLeft)
  const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

  return {
    x,
    y,
    scale
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable.styl'
@import '~@styles/mixin.styl'

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      .img
        width 100%
        height 100%
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-background-ll
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-background-ll
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-background-ll
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          box-sizing: border-box
          height: 100%
          .cd
            width: 100%
            height: 100%
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
          .pure-music
            padding-top: 50%
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-background-ll
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-background-ll
          &.disable
            color: $color-text-c
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-background-w
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      .img
        width 100%
        height 100%
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 32px
        color: $color-text
      .icon-mini
        position: absolute
        left: 0
        top: 0
        z-index -1
        font-size: 32px

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
