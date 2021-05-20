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
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    singer: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    pic() {
      return this.singer?.pic ?? ''
    },
    title() {
      return this.singer?.name ?? ''
    },
    loading() {
      return !this.songs.length
    }
  },
  async created() {
    const { songs } = await getSingerDetail(this.id)
    this.songs = await processSongs(songs)
    console.log(this.singer)
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
