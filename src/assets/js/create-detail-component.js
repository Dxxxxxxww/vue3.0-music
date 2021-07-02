import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      id: {
        type: [String, Number],
        default: ''
      },
      data: Object
    },
    data() {
      return {
        songs: []
      }
    },
    computed: {
      computedData() {
        const data = this.data
        let ret
        if (data.id || data.mid) {
          ret = data
        } else {
          const cache = storage.session.get(key)
          // this.$route.params.id
          if (cache && (cache.mid || cache.id + '') === this.id) {
            ret = cache
          }
        }
        return ret
      },
      pic() {
        return this.computedData?.pic ?? ''
      },
      title() {
        return this.computedData?.name ?? this.computedData?.title ?? ''
      },
      loading() {
        return !this.songs.length
      }
    },
    async created() {
      const computedData = this.computedData
      if (!computedData) {
        const path = this.$route.matched[0].path
        await this.$router.push({
          path
        })
        return
      }
      const { songs } = await fetch(computedData)
      this.songs = await processSongs(songs)
    }
  }
}
