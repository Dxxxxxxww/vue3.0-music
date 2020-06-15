<template>
  <div class="song-list">
    <ul></ul>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
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
</style>
