<template>
  <div v-loading="!singers.length" class="singer">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view :singer="singer"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/index-list'

export default {
  name: 'singer',
  components: { IndexList },
  data() {
    return {
      singers: [],
      singer: {}
    }
  },
  async created() {
    const { singers } = await getSingerList()
    this.singers = singers
  },
  methods: {
    selectSinger(singer) {
      this.singer = singer
      this.$router.push({ path: `/singer/${singer.mid}` })
    }
  }
}
</script>

<style scoped lang="scss">
// 滚动外层需要固定高度，这里使用 fixed 来定高
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
