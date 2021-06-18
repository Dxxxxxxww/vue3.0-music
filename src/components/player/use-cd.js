import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCd() {
  const cdRef = ref(null)
  const cdImgRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => (playing.value ? 'playing' : ''))

  watch(playing, newPlaying => {
    // 暂停时存储旋转角度到外部容器
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImgRef.value)
    }
  })

  // 将内部的旋转角度保存给父容器
  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    console.log(wrapperTransform, innerTransform)
    // wrapperTransform 初始值为 none
    // 内部旋转是基于父容器的，所以当第二次及后续都要将之前的旋转角度给加上
    wrapper.style.transform =
      wrapperTransform === 'none'
        ? innerTransform
        : `${innerTransform} ${wrapperTransform}`
    //  wrapperTransform.concat(' ', innerTransform)
  }

  return { cdRef, cdImgRef, cdCls }
}
