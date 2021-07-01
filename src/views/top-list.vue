<template>
  <div v-loading="loading" class="top-list">
    <music-scroll class="top-list-content">
      <ul>
        <li
          v-for="item of topList"
          :key="item.id"
          class="item"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" />
          </div>
          <ul class="song-list">
            <li
              v-for="(song, index) of item.songList"
              :key="song.id"
              class="song"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </music-scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getTopList } from '@/service/top-list'
import { ref } from 'vue'
import storage from 'good-storage'
import { TOP_KEY } from '@/assets/js/constant'
import { useRouter } from 'vue-router'

export default {
  name: 'top-list',
  // setup 前不能加 async 会导致组件无法渲染
  setup() {
    const topList = ref([])
    const loading = ref(true)
    const selectedTop = ref({})

    const router = useRouter()

    getTopList().then(res => {
      topList.value = res.topList
      loading.value = false
    })

    function cacheTop(album) {
      storage.session.set(TOP_KEY, album)
    }

    function selectItem(item) {
      selectedTop.value = item
      cacheTop(item)
      router.push({
        path: `/top-list/${item.id}`
      })
    }

    return {
      topList,
      loading,
      selectedTop,
      selectItem
    }
  }
}
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
