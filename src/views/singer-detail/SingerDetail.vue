<template>
  <transition appear name="slide">
    <div>
      <!-- 踩坑：当不给组件包裹 div 的时候，ref 始终无法绑定到组件上，当我偶然间将 div 包裹上去，发现可以绑定了-->
      <music-list
        ref="musicRef"
        :songs="songs"
        :title="singer.name"
        :bg-image="singer.avatar"
      ></music-list>
    </div>
  </transition>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getSingerDetail } from '@/api/singer'
import { HttpCode } from '@/lib/enum'
import { createSong, isValidMusic, processSongsUrl } from '@/lib/Song.js'
import playListHook from '@/hooks/playListHook'
import MusicList from '@/components/music-list/index.vue'

const { ERR_OK } = HttpCode

export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const singer = store.state.singerModule.singer

    const songs = ref([])
    const musicRef = ref(null)
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
          processSongsUrl(_normalizeSongs(result.data.list)).then(songList => {
            songs.value = songList
          })
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
    console.log(musicRef.value)
    onMounted(() => {
      console.log('==', musicRef.value)
      playListHook(musicRef.value.$el)
    })
    // const store = useStore()
    // const playList = computed(() => store.state.singerModule.playList)

    // onMounted(() => {
    //   handlePlayList(playList.value)
    // })

    // watch(playList, newVal => {
    //   handlePlayList(newVal)
    // })

    // function handlePlayList(playList) {
    //   const bottom = playList.length > 0 ? '60px' : ''
    //   musicRef.value.$el.style.bottom = bottom
    // }
    return { singer, songs, musicRef }
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
