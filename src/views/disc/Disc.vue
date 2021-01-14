<template>
  <div>
    <music-list
      ref="musicRef"
      :songs="songs"
      :title="disc.dissname"
      :bg-image="disc.imgurl"
    ></music-list>
  </div>
</template>

<script>
import MusicList from '@/components/music-list/index.vue'
import { getSongList } from '@/api/recommend'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { createSong, processSongsUrl } from '@/lib/Song'
import { HttpCode } from '@/lib/enum'

const { ERR_OK } = HttpCode

export default {
  name: 'Disc',
  components: {
    MusicList
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const disc = store.state.musicModule.disc

    watch(
      () => disc,
      currentVal => {
        if (!(currentVal && currentVal.id)) {
          router.push('/recommend')
        }
      }
    )

    const songs = ref([])
    const musicRef = ref(null)

    _getSongList()

    function _getSongList() {
      getSongList(disc.dissid)
        .then(res => {
          console.log('songs', res)
          if (res.code === ERR_OK) {
            processSongsUrl(_normalize(res.cdlist[0].songlist)).then(songList => {
              songs.value = songList
            })
          }
        })
        .catch(rej => {
          console.log(rej)
        })
    }

    function _normalize(list) {
      const ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          return ret.push(createSong(item))
        }
      })
      return ret
    }

    return { disc, songs, musicRef }
  }
}
</script>
