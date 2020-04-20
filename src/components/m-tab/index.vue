<template>
  <div class="tab">
    <div class="detail">≡</div>
    <router-link tag="div" class="tab-item" to="/mine">
      <span class="tab-link">我的</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/discovery">
      <span class="tab-link">发现</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <div class="search icon-search"></div>
  </div>
</template>

<script>
export default {
  name: 'MTab',
  data() {
    return {}
  }
}
</script>

<style scoped lang="stylus">
@import '~styles/variable.styl'

.tab
  display flex
  flex-direction row
  justify-content space-between
  align-items center
  height 44px
  padding 0 10px
  color $color-text-g
  .detail, .search
    font-size $font-size-medium-x
    color $color-text
  .tab-item
    display inline-block
    // 设定宽高防止抖动
    width 44px
    height 30px
    line-height 30px
    text-align center
    font-size $font-size-medium-x
    &.router-link-active
      .tab-link
        transform: translate3d(0, 0, 0)
        font-size $font-size-large-x
        color $color-text
        transition all .1s cubic-bezier(.17, .86, .73, .14)
</style>
