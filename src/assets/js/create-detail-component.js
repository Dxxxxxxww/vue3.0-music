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
      data: {
        type: Object,
        default() {
          return null
        }
      }
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
        if (data) {
          ret = data
          console.log(data)
        } else {
          const cache = storage.session.get(key)
          if (cache && (cache.id + '' || cache.mid) === this.$route.params.id) {
            ret = cache
          }
          console.log(data, 2)
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
