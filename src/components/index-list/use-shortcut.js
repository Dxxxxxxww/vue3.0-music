import { computed, ref } from 'vue'

export function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const touch = {}
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map(item => {
      return item.title
    })
  })

  function onShortcutTouchStart(e) {
    // 转成数字是因为下面跟 delta 做加法，如果是字符串就会变成拼接
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    // 对 0 或运算，转成 number
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(Math.min(shortcutList.value.length - 1, index), 0)
    const el = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(el, 0)
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
