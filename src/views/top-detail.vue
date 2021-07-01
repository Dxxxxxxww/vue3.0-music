<template>
  <div class="top-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      :rank="true"
    ></music-list>
  </div>
</template>

<script>
import { TOP_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
import { getTopDetail } from '@/service/top-list'

export default createDetailComponent('top-detail', TOP_KEY, getTopDetail)
</script>

<style scoped lang="scss">
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
