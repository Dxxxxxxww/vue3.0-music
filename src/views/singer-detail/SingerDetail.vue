<template>
  <transition appear name="slide">
    <music-list
      :songs="songsRef"
      :title="singer.name"
      :bg-image="singer.avatar"
    ></music-list>
  </transition>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getSingerDetail } from '@/api/singer'
import { HttpCode } from '@/lib/enum'
import { createSong, isValidMusic, processSongsUrl } from '@/lib/Song.js'
import MusicList from '@/components/music-list/index.vue'

const { ERR_OK } = HttpCode

export default {
  name: '',
  components: {
    MusicList
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const singer = store.getters['singerModule/singer']
    const songsRef = ref([])
    watch(
      () => singer,
      currentVal => {
        if (!(currentVal && currentVal.id)) {
          router.push('/singer')
        }
      }
    )
    const _getDetail = async ({ id }) => {
      if (!id) {
        router.push('/singer')
        return
      }
      try {
        const result = await getSingerDetail(id)
        if (result.code === ERR_OK) {
          processSongsUrl(_normalizeSongs(result.data.list)).then(songs => {
            songsRef.value = songs
          })
          console.log(songsRef)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const _normalizeSongs = list =>
      list.reduce((cur, next) => {
        if (isValidMusic(next.musicData)) {
          cur.push(createSong(next.musicData))
        }
        return cur
      }, [])

    _getDetail(singer)

    return { singer, songsRef }
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
