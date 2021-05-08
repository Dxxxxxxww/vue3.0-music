import { computed, nextTick, ref, watch } from 'vue'
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf
// asdfasdfasdfasdfasdf

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeight = []
  const scrollY = ref(0)
  const currentIndex = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    console.log(scrollY.value)
    return props.data[currentIndex.value]?.title ?? ''
  })

  watch(
    () => props.data,
    async () => {
      await nextTick()
      calculate()
    }
  )

  watch(scrollY, newVal => {
    // 减一是因为 listHeight 先 push 了 0，比 list 多了一位
    for (let i = 0; i < listHeight.length - 1; i++) {
      const topHeight = listHeight[i]
      const bottomHeight = listHeight[i + 1]
      if (scrollY.value >= topHeight && scrollY.value < bottomHeight) {
        currentIndex.value = i
      }
    }
  })

  // 计算高度集合
  function calculate() {
    const list = groupRef.value.children
    let height = 0
    listHeight.length = 0

    listHeight.push(height)

    for (const item of list) {
      height += item.clientHeight
      listHeight.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return { groupRef, fixedTitle, fixedStyle: '', onScroll }
}
