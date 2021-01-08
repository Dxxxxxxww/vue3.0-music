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
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Disc',
  components: {
    MusicList
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const disc = store.state.musicModule.disc
    console.log('disc--', disc)
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

    return { disc, songs, musicRef }
  }
}
</script>
