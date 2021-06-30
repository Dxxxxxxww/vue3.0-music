<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { ALBUM_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
import { getAlbum } from '@/service/recommend'

export default createDetailComponent('singer-detail', ALBUM_KEY, getAlbum)
</script>

<style scoped lang="scss">
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
