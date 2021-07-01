<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      v-model="query"
      type="text"
      class="input-inner"
      :placeholder="placeholder"
    />
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'

export default {
  name: 'search-input',
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      // input 上的 vmodel 是双向绑定，不能直接修改 modelValue 的值，所以需要用 data 保存一份中间数据
      query: this.modelValue
    }
  },
  created() {
    this.$watch(
      'query',
      debounce(300, newQuery => {
        this.$emit('update:modelValue', newQuery.trim())
      })
    )
    this.$watch('modelValue', newModelValue => {
      this.query = newModelValue
    })
  },
  methods: {
    clear() {
      this.query = ''
    }
  }
}
</script>

<style scoped lang="scss">
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
