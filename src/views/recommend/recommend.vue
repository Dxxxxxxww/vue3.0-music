<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <div class="slider-content" v-if="recommends.length">
          <m-slider :loop="true">
            <div v-for="item of recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" />
              </a>
            </div>
          </m-slider>
        </div>
      </div>
      <div class="recommend-list">
        <h1 class="list-title"></h1>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from '@/api/recommend'
import MSlider from '@components/m-slider/index'
import config from '@/config/config'

const { ERR_OK } = config.code
const { log } = console

export default {
  name: 'Recommend',
  components: {
    MSlider
  },
  data() {
    return {
      recommends: []
    }
  },
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          log(res.data)
          this.recommends = res.data.slider
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~@styles/variable'

.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      height 0
      padding-bottom 40%
      // padding-top 40% 这里如果是 top 的话会把内容(子元素)在地板，挤出了范围然后被 overflow hidden 就不可见了,就得使用 slider-content 这一层的样式让元素显示。不过这一层的元素是要的，是为了不让图片还未加载的时候元素不渲染时会抖动。
      // padding-bottom 的话内容在天花板，子元素还是可以显现的，就不需要 slider-content 这一层的样式
      overflow hidden
      .slider-content
        // position absolute
        // top 0
        // left 0
        // width 100%
        // height 100%
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
</style>
