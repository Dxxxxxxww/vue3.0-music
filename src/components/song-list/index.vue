<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song, index) of songs"
        :key="index"
        class="item"
      >
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, context) {
    function getDesc(song) {
      return `${song.singer} 。${song.album}`
    }

    const selectItem = (item, index) => {
      context.emit('select', { item, index })
    }

    return { getDesc, selectItem }
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable'
@import '~@styles/mixin'

.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>
