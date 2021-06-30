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
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'

export default createDetailComponent(
  'singer-detail',
  SINGER_KEY,
  getSingerDetail
)

// export default {
//   name: 'singer-detail',
//   components: {
//     MusicList
//   },
//   props: {
//     mid: {
//       type: [String, Number],
//       default: ''
//     },
//     singer: {
//       type: Object,
//       default() {
//         return {}
//       }
//     }
//   },
//   data() {
//     return {
//       songs: []
//     }
//   },
//   computed: {
//     computedSinger() {
//       const singer = this.singer
//       let ret
//       if (singer.mid) {
//         ret = singer
//       } else {
//         const cacheSinger = storage.session.get(SINGER_KEY)
//         if (cacheSinger && cacheSinger.mid === this.$route.params.mid) {
//           ret = cacheSinger
//         }
//       }
//       return ret
//     },
//     pic() {
//       return this.computedSinger?.pic ?? ''
//     },
//     title() {
//       return this.computedSinger?.name ?? ''
//     },
//     loading() {
//       return !this.songs.length
//     }
//   },
//   async created() {
//     if (!this.computedSinger) {
//       const path = this.$route.matched[0].path
//       await this.$router.push({
//         path
//       })
//       return
//     }
//     const { songs } = await getSingerDetail(this.computedSinger.mid)
//     this.songs = await processSongs(songs)
//   }
// }
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
