<template>
  <div class="tab">
    <div class="detail" @click="handleClick($event)">≡</div>
    <router-link tag="div" class="tab-item" to="/mine">
      <span class="tab-link" @click="handleClick($event)">我的</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/discovery">
      <span class="tab-link" @click="handleClick($event)">发现</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link" @click="handleClick($event)">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link" @click="handleClick($event)">歌手</span>
    </router-link>
    <div class="search icon-search" @click="handleClick($event)"></div>
    <div class="animate" :style="[animatePos]">
      <click-ripple></click-ripple>
    </div>
  </div>
</template>

<script>
import ClickRipple from '@components/animate/click-ripple/index'

export default {
  name: 'MTab',
  components: {
    ClickRipple
  },
  data() {
    return {
      animatePos: {
        left: 0,
        top: 0
      }
    }
  },
  methods: {
    handleClick(e) {
      this.animatePos.left = e.target.offsetLeft + 'px'
      this.animatePos.top = e.target.offsetTop + 'px'
      console.log(e.target.offsetLeft, this.animatePos.left)
      console.log(e.target.offsetTop, this.animatePos.top)
    }
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
    z-index 1
    font-size $font-size-medium-x
    color $color-text
  .tab-item
    z-index 1
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
  .animate
    z-index 0
    position absolute
</style>
