import {
  ref,
  computed,
  h,
  mergeProps,
  renderSlot,
  watch,
  withCtx,
  nextTick
} from 'vue'
import MusicScroll from '@/components/base/scroll/music-scroll'
import { useStore } from 'vuex'

export default {
  name: 'wrapper-scroll',
  props: MusicScroll.props,
  emits: MusicScroll.emits,
  render(ctx) {
    return h(
      MusicScroll,
      mergeProps(ctx.$props, {
        ref: 'scrollRef',
        onScroll: e => {
          ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => [renderSlot(ctx.$slots, 'default')])
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()
    // 监听是否有歌曲播放，从而刷新 scroll
    // 解决 mini-player 组件出现时的滚动高度问题，mini-player 会遮住列表
    const playList = computed(() => store.state.playList)
    // better-scroll 实例
    // 用计算属性返回是因为，如果直接返回的话，当 dom 没有渲染， scrollRef 为 null，会有问题
    // 而通过计算属性，这样只有使用到 scroll 的时候才会去计算，而使用到 scroll 的时候，dom 必然已经渲染了
    const scroll = computed(() => scrollRef.value.scroll)

    watch(playList, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll // scrollRef.value.scroll
    }
  }
}
