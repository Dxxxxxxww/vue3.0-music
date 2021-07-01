<template>
  <div
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
    ref="rootRef"
    class="suggest"
  >
    <ul class="suggest-list">
      <li v-if="singer" class="suggest-item" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        v-for="song in songs"
        :key="song.id"
        class="suggest-item"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}--{{ song.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    // data
    const loadingText = ref('')
    const page = ref(1)
    const hasMore = ref(true)
    const songs = ref([])
    const singer = ref(null)
    const noResultText = ref('抱歉，暂无搜索结果')
    // computed
    const loading = computed(() => !singer.value && !songs.value.length)
    const noResult = computed(
      () => !singer.value && !songs.value.length && !hasMore.value
    )
    // watch
    watch(
      () => props.query,
      async newQuery => {
        await searchFirst(newQuery)
      }
    )
    // function
    // 查询时的搜索
    async function searchFirst(query) {
      // 清空前一次数据
      page.value = 1
      hasMore.value = true
      songs.value = []
      singer.value = null

      const result = await search(query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
    }
    function selectSinger() {}

    function selectSong() {}

    return {
      // data
      singer,
      songs,
      loadingText,
      noResultText,
      // computed
      loading,
      noResult,
      // function
      selectSinger,
      selectSong
    }
  }
}
</script>

<style scoped lang="scss">
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    text-align: left;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
