import { ref } from 'vue'

export default function useMiddleInteractive() {
  // 存储滑动时相关数据
  const touch = {}
  // 歌词和cd模块切换有个过渡动效，所以需要两个变量来控制实际切换
  // 应当显示模块
  const currentShow = ref('cd')
  // 当前实际显示模块
  let currentView = 'cd'
  // cd 样式
  const middleLStyle = ref(null)
  // 歌词样式
  const middleRStyle = ref(null)

  function onTouchStart(e) {
    // 记录滑动刚开始时的横坐标
    touch.startX = e.touches[0].pageX
  }

  function onTouchMove(e) {
    // 判断当前实际显示模块
    const isCd = currentView === 'cd'
    // 滑动偏移量
    const delta = e.touches[0].pageX - touch.startX
    // 根据当前显示模块变量，获取歌词模块的偏移量
    const left = isCd ? 0 : -window.innerWidth
    // 计算当前歌词模块的偏移值，并设定上下限 0 ~ -window.innerWidth
    const offsetWidth = Math.max(-window.innerWidth, Math.min(0, delta + left))
    // 存储偏移百分比
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    // 如果当前实际显示的是 cd模块
    if (isCd) {
      // 当歌词模块屏幕占比超过20%，则表示当前模块应当为歌词模块
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 当前显示的是 歌词模块
      // 如果当前歌词模块的屏幕占比小于80%，则表示当前模块应当为cd模块
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    // 修改对应模块的 style
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }

  function onTouchEnd() {
    // 动画时长 300ms
    const duration = '300ms'
    let offsetWidth, opacity
    // 如果当前应当是 cd模块，将实际显示模块更改为 cd模块
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      opacity = 1
      offsetWidth = 0
    } else {
      // 如果当前应当是歌词模块，将实际显示模块更改为歌词模块
      currentView = 'lyric'
      opacity = 0
      offsetWidth = -window.innerWidth
    }
    // 修改对应模块的 style
    middleLStyle.value = {
      opacity,
      transitionDuration: duration
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: duration
    }
  }

  return {
    currentShow,
    currentView,
    middleLStyle,
    middleRStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}
