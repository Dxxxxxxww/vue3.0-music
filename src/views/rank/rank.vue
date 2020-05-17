<template>
  <div class="rank">
    <span ref="print" v-show="show">排名a</span>
    <input type="text" name="" class="ipt" ref="ipt" />
  </div>
</template>

<script>
export default {
  name: 'Rank',
  data() {
    return {
      height: document.documentElement.clientHeight,
      showHeight: document.documentElement.clientHeight,
      show: true
    }
  },
  watch: {
    showHeight(newV) {
      this.$refs.print.innerText += newV + '--'
      this.show = !(this.height > newV) // this.showHeight
    }
  },
  // activated() {
  //   },
  created() {
    // window.location.href = 'http://localhost:8080/#/singer'
    console.log(456, location.href)
    const docEle = document.documentElement || document.body
    this.height = docEle.clientHeight
    this.showHeight = docEle.clientHeight
    // 安卓可以 iOS不行
    // window.addEventListener('resize', () => {
    //   this.$refs.print.innerText += 'its resized'
    // })
    // document.documentElement 不会触发 resize 事件 也就是说 html 没有 resize
    // document.documentElement.onresize = () => {
    //   this.$refs.print.innerText += 'its resized'
    // }
    // body 安卓可以
    // document.body.onresize = () => {
    //   this.$refs.print.innerText += 'its resized'
    // }
    window.onresize = () => {
      // this.$refs.print.innerText += 'its resized'
      this.showHeight = document.documentElement.clientHeight
    }
    // 也就是说在输入框获取焦点的时候 iOS会把页面抬起，而安卓会改变视口大小
  },
  mounted() {
    console.log(this.$refs.ipt, this.$refs.ipt.type)
  }
}
</script>

<style scoped lang="stylus">
.rank
  display flex
  justify-content center
  align-items center
  .ipt
    margin-top 500px
    border 1px solid #ccc
</style>
