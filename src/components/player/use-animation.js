import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  // cd容器ref
  const cdWrapperRef = ref(null)
  // 动画锁
  let entering = false
  let leaving = false

  function enter(el, done) {
    // 离开动画还未结束时就触发了进入动画，会导致离开动画回调无法执行
    // 手动执行离开结束动画
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    // 定义动画
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    // 注册动画
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter() {
    entering = false
    // 注销动画
    animations.unregisterAnimation('move')
    // 清空动画
    cdWrapperRef.value.style.animation = ''
  }

  function leave(el, done) {
    // 进入动画还未结束就触发了离开动画，会导致进入动画回调无法执行
    // 手动执行进入结束动画
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperRefVal = cdWrapperRef.value

    cdWrapperRefVal.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperRefVal.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

    cdWrapperRefVal.addEventListener('transitionend', next)

    function next() {
      done()
      cdWrapperRefVal.removeEventListener('transitionend', next)
    }

    // 也可以使用 animation
    // const animation = {
    //   0: {
    //     transform: 'translate3d(0, 0, 0) scale(1)'
    //   },
    //   100: {
    //     transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    //   }
    // }
    // // 注册动画
    // animations.registerAnimation({
    //   name: 'move',
    //   animation,
    //   presets: {
    //     duration: 600,
    //     easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
    //   }
    // })
    // animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterLeave() {
    leaving = false
    const cdWrapperRefVal = cdWrapperRef.value
    cdWrapperRefVal.style.transition = ''
    cdWrapperRefVal.style.transform = ''
  }

  function getPosAndScale() {
    // mini cd 的宽度
    const targetWidth = 40
    // mini cd 圆心距离左边屏幕的距离
    const paddingLeft = 20 + 20
    // moni cd 圆心距离底部屏幕的距离
    const paddingBottom = 20 + 10
    // cd 距离顶部屏幕的距离
    const paddingTop = 60 + 20
    // cd 的宽度
    const width = window.innerWidth * 0.8
    // x轴的偏移量，向左偏移为负值
    const x = -(window.innerWidth / 2 - paddingLeft)
    // y轴的偏移量，向下偏移为正值
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    // 缩放比
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
