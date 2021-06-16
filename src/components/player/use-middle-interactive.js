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
  // 默认允许歌词自动滚动
  const canLyricScroll = ref(true)

  function onTouchStart(e) {
    // 记录滑动刚开始时的横坐标
    touch.startX = e.touches[0].pageX
    // 记录滑动刚开始时的纵坐标
    touch.startY = e.touches[0].pageY
    // 初始化方向锁
    touch.directionLocked = ''
  }

  function onTouchMove(e) {
    // 横向滑动偏移量
    const deltaX = e.touches[0].pageX - touch.startX
    // 纵向滑动偏移量
    const deltaY = e.touches[0].pageY - touch.startY
    // 记录横纵偏移量的绝对值
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    // 判断当前实际显示模块
    const isCd = currentView === 'cd'

    if (!touch.directionLocked) {
      // 如果横向 > 纵向，则锁定方向为横向，反之，纵向
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    // 如果是纵向滚动，则不执行后续横向滚动逻辑
    if (touch.directionLocked === 'v') {
      // 用户纵向滚动歌词时，禁止歌词自动滚动
      if (!isCd) {
        canLyricScroll.value = false
      }
      return
    }

    // 根据当前显示模块变量，获取歌词模块的偏移量
    const left = isCd ? 0 : -window.innerWidth
    // 计算当前歌词模块的偏移值，并设定上下限 0 ~ -window.innerWidth
    const offsetWidth = Math.max(-window.innerWidth, Math.min(0, deltaX + left))
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
      opacity: 1 - touch.percent
      // 不加这个也没事
      // transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
      // transitionDuration: '0ms'
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
    // 用户纵向滚动结束，允许歌词自动滚动
    canLyricScroll.value = true
  }

  return {
    currentShow,
    canLyricScroll,
    middleLStyle,
    middleRStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}
