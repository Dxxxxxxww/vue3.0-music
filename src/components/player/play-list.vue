<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        v-show="visible && playList.length"
        class="playlist"
        @click.stop="hide"
      >
        <!-- 设置一个空的点击事件，来阻止冒泡，否则点击列表中空白地方也会向上冒泡触发 hide -->
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="iconMode" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <music-scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                v-for="song of playList"
                :key="song.id"
                class="item"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click="toggleFavorite(song)"
                  ><i :class="getFavoriteIcon(song)"></i
                ></span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </music-scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
          <music-confirm
            ref="confirmRef"
            text="是否清空播放列表？"
            confirm-btn-text="清空"
            @confirm="confirmClear"
          ></music-confirm>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'
import useMode from '@/components/player/use-mode'
import useFavorite from '@/components/player/use-favorite'

export default {
  name: 'play-list',
  data() {
    return {}
  },
  setup() {
    // refs
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    // data
    const visible = ref(false)
    // 移除锁，避免对同一首歌进行删除，导致bug
    const removing = ref(false)
    // vuex
    const store = useStore()
    const playList = computed(() => store.state.playList)
    // 个人认为播放列表应该是当前播放模式的列表而非顺序列表
    // const sequenceList = computed(() => store.state.sequenceList)
    const playMode = computed(() => store.state.playMode)
    const currentSong = computed(() => store.getters.currentSong)
    // watch
    watch(currentSong, async newSong => {
      // 如果列表没有展示，或者歌曲不合法则不作任何操作
      if (!visible.value || !newSong.id) {
        return
      }
      // dom 准备完再滚动 原理见 ./use-mini-slider
      await nextTick()
      scrollToCurrentSong()
    })
    // 播放模式从 随机/顺序 切换时，滚动到当前播放歌曲
    watch(playMode, async newMode => {
      if (newMode !== PLAY_MODE.loop) {
        // dom 准备完再滚动 原理见 ./use-mini-slider
        await nextTick()
        scrollToCurrentSong()
      }
    })
    // funciton
    // 显示播放列表
    async function show() {
      await nextTick()
      scrollRef.value.scroll.refresh()
      visible.value = true
    }
    // 隐藏播放列表
    function hide() {
      visible.value = false
    }
    // 显示当前播放歌曲的icon
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    // 点击歌曲切歌
    function selectItem(song) {
      const index = playList.value.findIndex(item => item.id === song.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingStatus', true)
    }
    // 滚动到当前播放歌曲
    function scrollToCurrentSong() {
      const index = playList.value.findIndex(
        item => item.id === currentSong.value.id
      )
      // 如果未找到歌曲直接返回
      if (index === -1) return
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    // 移除歌曲
    function removeSong(song) {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      // 如果播放列表没有歌曲，则隐藏播放列表
      if (!playList.value.length) {
        hide()
      }
      // 300ms 是移除歌曲动画时长
      setTimeout(() => {
        removing.value = false
      }, 300)
    }
    // 清空歌曲列表
    function confirmClear() {
      store.dispatch('clearSongList')
      // 如果播放列表没有歌曲，则隐藏播放列表
      hide()
    }
    // 展示清空confirm
    function showConfirm() {
      confirmRef.value.show()
    }
    // hooks
    const { iconMode, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    return {
      // refs
      scrollRef,
      listRef,
      confirmRef,
      // data
      visible,
      removing,
      playList,
      // sequenceList,
      show,
      hide,
      getCurrentIcon,
      selectItem,
      removeSong,
      confirmClear,
      showConfirm,
      // useMode
      iconMode,
      modeText,
      changeMode,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style scoped lang="scss">
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
