<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <Scroll v-show="!query" ref="scrollRef" class="search-content">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul @click.stop="addQuery">
            <li
              v-for="item in hotKeys"
              :key="item.id"
              class="item"
              :data-query="item.key"
            >
              {{ item.key }}
            </li>
          </ul>
        </div>
        <div v-show="searchHistory.length" class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <music-confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></music-confirm>
          <search-list
            :searches="searchHistory"
            @select="selectItem"
            @delete="deleteSearchItem"
          ></search-list>
        </div>
      </div>
    </Scroll>
    <div v-show="query" class="search-result">
      <suggest
        :query="query"
        @select-singer="selectSinger"
        @select-song="selectSong"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import Suggest from '@/components/search/suggest'
import SearchInput from '@/components/search/search-input'
import Scroll from '@/components/wrapper-scroll'
import { computed, nextTick, ref, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/use-search-history'
import MusicConfirm from '@/components/base/confirm/music-confirm'

export default {
  name: 'search',
  components: { MusicConfirm, Suggest, SearchInput, Scroll },
  setup() {
    // refs
    const scrollRef = ref(null)
    const confirmRef = ref(null)
    // data
    const store = useStore()
    const router = useRouter()
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)

    const searchHistory = computed(() => store.state.searchHistory)

    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys
    })
    // watch
    // 监听搜索内容变化，清空搜索内容时刷新滚动组件
    watch(query, async newQuery => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    // function
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    // event
    function addQuery(e) {
      if (e.target.nodeName.toLowerCase() === 'li') {
        selectItem(e.target.dataset.query)
      }
    }

    function selectSinger(singer) {
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({ path: `/search/${singer.mid}` })
      saveSearch(query.value)
    }

    function selectSong(song) {
      store.dispatch('addSong', song)
      saveSearch(query.value)
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    function selectItem(queryStr) {
      query.value = queryStr.trim()
    }

    function deleteSearchItem(query) {
      deleteSearch(query)
    }

    function showConfirm() {
      confirmRef.value.show()
    }
    // hooks
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    return {
      // ref
      scrollRef,
      confirmRef,
      // data
      query,
      hotKeys,
      selectedSinger,
      searchHistory,
      // event
      addQuery,
      selectSinger,
      selectSong,
      selectItem,
      deleteSearchItem,
      showConfirm,
      clearSearch
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    text-align: left;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
