<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">鱼瓜云音乐</div>
  </div>
</template>

<script>
export default {
  name: 'MHeader',
  data() {
    return {}
  }
}
</script>

<style scoped lang="stylus">
@import '~@styles/variable.styl'
@import '~@styles/mixin.styl'

.m-header
  text-align center
  .icon
    display inline-block
    width 30px
    height 32px
    margin-top 6px
    margin-right 9px
    vertical-align top
    bg-image('~@assets/img/logo')
    background-size 30px 32px
    background-repeat no-repeat
  .text
    display inline-block
    vertical-align top
    line-height 44px
    font-size $font-size-large
    color $color-text-d
</style>
