<template>
  <m-scroll class="listview" :data="data">
    <ul>
      <li class="list-group" v-for="group of data" :key="group.title">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item of group.items"
            :key="item.id"
          >
            <img class="avatar" :src="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </m-scroll>
</template>

<script>
import MScroll from '@components/m-scroll/index'

export default {
  name: 'MListview',
  components: {
    MScroll
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable'

.listview
  position fixed
  width 100%
  top 88px
  bottom 0
  overflow hidden
  background-color $color-e-ll
  .list-group
    padding-bottom: 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-n
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        padding-left 20px
        color $color-text
        font-size $font-size-medium
</style>
