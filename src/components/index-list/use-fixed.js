import { ref } from 'vue'

export default function useFixed() {
  const groupRef = ref(null)
  const heightList = []

  calculate()

  // 计算高度集合
  function calculate() {
    const list = groupRef.value.children
    let height = 0
    heightList.length = 0

    heightList.push(height)

    for (const item of list) {
      height += item.clientHeight
      heightList.push(height)
    }
  }

  return { groupRef, fixedTitle: '', fixedStyle: '' }
}
