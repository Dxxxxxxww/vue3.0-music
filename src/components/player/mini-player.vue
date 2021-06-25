<template>
  <transition name="mini">
    <div v-show="!fullScreen" class="mini-player" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img
            ref="cdImgRef"
            width="40"
            height="40"
            :src="currentSong.pic"
            :class="cdCls"
          />
        </div>
      </div>
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div v-for="song of playList" :key="song.id" class="slider-page">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <play-list ref="playListRef"></play-list>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useCd from './use-cd'
import ProgressCircle from './progress-circle'
import useMiniSlider from '@/components/player/use-mini-slider'
import PlayList from './play-list'

export default {
  name: 'mini-player',
  components: { ProgressCircle, PlayList },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup() {
    // refs
    const playListRef = ref(null)
    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playList = computed(() => store.state.playList)
    const playing = computed(() => store.state.playing)
    // computed
    const miniPlayIcon = computed(() =>
      playing.value ? 'icon-pause' : 'icon-play-mini'
    )
    // 同步 player 和 miniPlayer 的 cd 旋转角度
    // watch(fullScreen, newVal => {
    // const cdRefVal = cdRef.value
    // if (!newVal) {
    //   cdRef.value.style.transform = store.state.wrapperTransform
    //   console.log('miniplayer--', store.state.wrapperTransform)
    // }
    // else {
    //   store.commit('setWrapperTransform', cdRefVal.style.transform)
    //   emit('cc', cdRefVal.style.transform)
    // }
    // })
    function showNormalPlayer() {
      store.commit('setFullScreen', true)
    }

    function showPlayList() {
      playListRef.value.show()
    }
    // hooks
    const { cdRef, cdImgRef, cdCls } = useCd()
    const { sliderWrapperRef } = useMiniSlider()

    return {
      playListRef,
      // vuex
      fullScreen,
      currentSong,
      playList,
      // computed
      miniPlayIcon,
      // function
      showNormalPlayer,
      showPlayList,
      // useCd
      cdRef,
      cdImgRef,
      cdCls,
      // useMiniSlider
      sliderWrapperRef
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        text-align: left;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
