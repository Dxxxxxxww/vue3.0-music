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
      <div v-loading:[loadingText]="pullUpLoading" class="suggest-item"></div>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    // data
    const loadingText = ref('')
    const page = ref(1)
    const hasMore = ref(true)
    const songs = ref([])
    const singer = ref(null)
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)
    // computed
    const loading = computed(() => !singer.value && !songs.value.length)
    const noResult = computed(
      () => !singer.value && !songs.value.length && !hasMore.value
    )
    const pullUpLoading = computed(() => isPullUpload.value && hasMore.value)
    // 在首次加载或者自动加载时阻止上拉加载
    const preventPullUpLoad = computed(
      () => loading.value || manualLoading.value
    )
    // watch
    watch(
      () => props.query,
      async newQuery => {
        if (newQuery) {
          await searchFirst(newQuery)
        }
      }
    )
    // function
    // 查询时的搜索
    async function searchFirst(query) {
      if (!query) {
        return
      }
      // 清空前一次数据
      page.value = 1
      hasMore.value = true
      songs.value = []
      singer.value = null

      const result = await search(query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      // 如果数据不满足一屏，则继续请求
      await nextTick()
      await makeItScroll()
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      // 单页数据不满一屏时继续加载下一页数据
      await makeItScroll()
    }
    // 单页数据不满一屏时继续加载下一页数据
    async function makeItScroll() {
      // 如果 scroll 不满足滚动条件，父容器高度大于内容高度。
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    function selectSong(song) {
      emit('select-song', song)
    }

    // hooks
    const { rootRef, scroll, isPullUpload } = usePullUpLoad(
      searchMore,
      preventPullUpLoad
    )

    return {
      // data
      singer,
      songs,
      loadingText,
      noResultText,
      // computed
      loading,
      noResult,
      pullUpLoading,
      // function
      selectSinger,
      selectSong,
      // usePullUpLoad
      rootRef,
      isPullUpload
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
