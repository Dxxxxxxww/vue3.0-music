<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div v-show="!query" class="search-content">
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
    </div>
    <div v-show="query" class="search-result">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import Suggest from '@/components/search/suggest'
import SearchInput from '@/components/search/search-input'
import { ref } from 'vue'
import { getHotKeys } from '@/service/search'
export default {
  name: 'search',
  components: { Suggest, SearchInput },
  setup() {
    const query = ref('')
    const hotKeys = ref([])

    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys
    })

    function addQuery(e) {
      query.value = e.target.dataset.query
    }

    return {
      query,
      hotKeys,
      addQuery
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
    .hot-keys {
      margin: 0 20px 20px 20px;
      text-align: left;
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
