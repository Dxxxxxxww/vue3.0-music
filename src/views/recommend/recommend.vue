<template>
  <div class="recommend" ref="scrollWrapperRef">
    <m-scroll ref="scroll" :data="discList" class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content" v-if="recommends.length">
            <m-slider :loop="true">
              <div v-for="item of recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" />
                </a>
                <!-- fastclick 监测到元素有 needsclick 这个类就不会对其进行拦截  class="needsclick" 不过我现在这个版本的 fastclick和 BScroll 没有冲突，不必加 -->
              </div>
            </m-slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) of discList" :key="index" class="item">
              <div class="icon">
                <img width="60" height="60" :src="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading />
        </div>
      </div>
    </m-scroll>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getRecommend, getDiscList } from '@/api/recommend'
import MSlider from '@components/m-slider/index'
import MScroll from '@components/m-scroll/index'
import Loading from '@components/loading/loading'
import { HttpCode } from '@/lib/enum'
import playListHook from '@/hooks/playListHook'

const { ERR_OK } = HttpCode
const { log } = console

export default {
  name: 'Recommend',
  components: {
    MSlider,
    MScroll,
    Loading
  },
  setup() {
    const recommends = ref([])
    const discList = ref([])
    const scrollWrapperRef = ref(null)

    onMounted(() => {
      playListHook(scrollWrapperRef.value)
    })

    _getRecommend()
    _getDiscList()

    function loadImage() {
      // 为了保证轮播图的加载后高度才是正常的，在这里刷新一下 BScroll
      // 防止 BScroll 滚动出现问题。但是并不需要这样做，因为轮播图高度
      // 已经通过 padding-bottom 撑开了，m-scroll 的滚动高度已经是正常的了
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }

    // 在入口文件加上 keep-alive 避免每次切换路由都要重新渲染dom而重新请求
    function _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          recommends.value = res.data.slider
        }
      })
      // .catch(rej => {
      // api 返回的 reject 可以在这里 catch 住
      // console.log('reject', rej)
      // })
    }
    function _getDiscList() {
      getDiscList()
        .then(res => {
          log('resres', res.data)
          discList.value = res.data.list
        })
        .catch(rej => {
          log(rej)
        })
    }

    return {
      recommends,
      discList,
      scrollWrapperRef,
      loadImage
    }
  }
  // data() {
  //   return {
  //     recommends: [],
  //     discList: []
  //   }
  // },
  // created() {
  //   this._getRecommend()
  //   this._getDiscList()
  // },
  // methods: {
  //   // 在入口文件加上 keep-alive 避免每次切换路由都要重新渲染dom而重新请求
  //   _getRecommend() {
  //     getRecommend().then(res => {
  //       if (res.code === ERR_OK) {
  //         this.recommends = res.data.slider
  //       }
  //     })
  //     // .catch(rej => {
  //     // api 返回的 reject 可以在这里 catch 住
  //     // console.log('reject', rej)
  //     // })
  //   },
  //   _getDiscList() {
  //     getDiscList()
  //       .then(res => {
  //         log('resres', res.data)
  //         this.discList = res.data.list
  //       })
  //       .catch(rej => {
  //         log(rej)
  //       })
  //   },
  //   loadImage() {
  //     // 为了保证轮播图的加载后高度才是正常的，在这里刷新一下 BScroll
  //     // 防止 BScroll 滚动出现问题。但是并不需要这样做，因为轮播图高度
  //     // 已经通过 padding-bottom 撑开了，m-scroll 的滚动高度已经是正常的了
  //     // if (!this.checkLoaded) {
  //     //   this.$refs.scroll.refresh()
  //     //   this.checkLoaded = true
  //     // }
  //   }
  // }
}
</script>

<style lang="stylus">
@import '~@styles/variable'

.recommend
  position fixed
  width 100%
  top 44px
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
        color $color-text-dd
      .item
        display flex
        align-items center
        box-sizing border-box
        padding 0 20px 20px 20px
        .icon
          flex 0 0 60px
          width 60px
          padding-right 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
