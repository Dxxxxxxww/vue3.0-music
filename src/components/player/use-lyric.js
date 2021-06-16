import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime, canLyricScroll }) {
  const store = useStore()
  // 格式化歌词实例
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  let increaseFlag = 0
  // 获取当前歌曲
  const currentSong = computed(() => store.getters.currentSong)
  // 监听歌曲变化，异步获取歌词
  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // 切换歌曲时暂停歌词滚动
    stopLyric()
    // 防止切换歌曲过快导致歌词滚动时跳动，需要将歌词重置
    currentLineNum.value = 0
    currentLyric.value = null
    pureMusicLyric.value = ''
    playingLyric.value = ''
    // 获取歌词
    const lyric = await getLyric(newSong)
    // 给歌曲本身添加歌词
    store.commit('setSongLyric', { song: newSong, lyric })
    // 获取歌词是个异步过程，快速切换歌曲可能会导致歌曲与歌词不匹配
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 创建格式化后的歌词实例
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      // 歌曲准备好后才可以播放歌词
      // 如果歌词先于歌曲准备完毕，也要等歌曲准备完毕才能播放歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  watch(canLyricScroll, (nv) => {
    increaseFlag += 1
    console.log('watch', increaseFlag, nv)
    // // 获取歌词固定滚动位置的元素，让歌词在屏幕中间滚动
    // setTimeout(() => {
    //   const lineEl = listEl.children[lineNum - 5]
    //   lyricComp.scroll.scrollToElement(lineEl, 1000)
    // }, 200)
  })

  function handleLyric({ lineNum, txt }) {
    // 获取当前歌词的行数
    currentLineNum.value = lineNum
    // 获取当前歌词
    playingLyric.value = txt
    // 获取 scroll
    const lyricComp = lyricScrollRef.value
    // 获取 歌词数组 元素
    const listEl = lyricListRef.value
    // 如果用户在滚动，则歌词停止自动滚动
    if (!canLyricScroll.value) {
      return
    }
    // 滚动至对应的歌词元素
    if (lineNum > 5) {
      // 获取歌词固定滚动位置的元素，让歌词在屏幕中间滚动
      const lineEl = listEl.children[lineNum - 5]
      lyricComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      lyricComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  // 播放歌词，在歌词和歌曲准备完毕时都会调用，双重确保歌词一定会被播放
  function playLyric() {
    const currentLyricVal = currentLyric.value
    // 如果歌曲先于歌词返回请求结果，需要等歌词准备完毕才能播放歌词
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    // 如果歌曲先于歌词返回请求结果，需要等歌词准备完毕才能播放歌词
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  return {
    lyricScrollRef,
    lyricListRef,
    currentLyric,
    currentLineNum,
    playingLyric,
    pureMusicLyric,
    playLyric,
    stopLyric
  }
}
