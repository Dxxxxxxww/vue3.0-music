<template>
  <div class="singer" ref="singerRef">
    <m-listview
      :data="singersRef"
      @select="handleSelect"
      ref="listRef"
    ></m-listview>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getSingerList } from '@/api/singer'
import { HttpCode } from '@/lib/enum'
import Singer from '@/lib/Singer'
import playListHook from '@/hooks/playListHook'
import MListview from './singer-compontets/m-listview'

// const { log } = console
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  components: {
    MListview
  },
  setup() {
    const singersRef = ref([])
    const router = useRouter()
    const store = useStore()
    const singerRef = ref(null)
    const listRef = ref(null)

    onMounted(() => {
      _getSingerList()
      console.log('==', singerRef.value)
      playListHook(singerRef.value.$el)
    })
    // 可以直接在 setup 里调用
    // _getSingerList()

    function _getSingerList() {
      getSingerList().then(res => {
        if (res.code === HttpCode.ERR_OK) {
          singersRef.value = _normalizeSinger(res.data.list)
        }
      })
    }

    function _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((v, i) => {
        // 使用常量取代魔法值
        if (i < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(v.Fsinger_mid, v.Fsinger_name))
          // 如果是我的话应该会建一个函数传入 mid 来返回 avatar，老师则是使用类来直接 new
          // map.hot.items.push({
          //   id: v.Fsinger_mid,
          //   name: v.Fsinger_name,
          //   avatar: getAvatar((id: v.Fsinger_mid))
          // })
          // avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${v.Fsinger_mid}.jpg?max_age=2592000`
        }
        const key = v.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(v.Fsinger_mid, v.Fsinger_name))
      })
      // 这里的 map 是对象，不能保证是有序的
      // 处理 map 得到有序数据
      const hot = [],
        ret = []
      for (const k in map) {
        const v = map[k]
        if (v.title.match(/[a-zA-Z]/)) {
          ret.push(v)
        } else if (v.title === HOT_NAME) {
          // 排除掉 多余的那个 title = 9 的数据
          hot.push(v)
        }
      }
      // 通过 Unicode 码点来排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }

    const handleSelect = singer => {
      store.commit('singerModule/setSinger', singer)
      router.push({ path: `/singer/${singer.id}` })
    }

    return { singersRef, handleSelect, singerRef, listRef }
  }
}
</script>

<style scoped lang="stylus">
.singer
  position fixed;
  top: 44px;
  width 100%;
  bottom 0;
</style>
