<template>
  <div class="singer-detail">
    <!--    <music-list-->
    <!--      :songs="songs"-->
    <!--      :title="title"-->
    <!--      :pic="pic"-->
    <!--      :loading="loading"-->
    <!--    ></music-list>-->
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
// import MusicList from '@/components/music-list/music-list'
import { processSongs } from '@/service/song'

export default {
  name: 'singer-detail',
  components: {
    // MusicList
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      songs: []
    }
  },

  async created() {
    const { songs } = await getSingerDetail(this.id)
    this.songs = await processSongs(songs)
  }
}
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
