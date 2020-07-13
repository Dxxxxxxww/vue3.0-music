<template>
  <div>
    <form action="" @scroll="submit"></form>
    <div @click="copyText">copy</div>
    <div @click="copyText">copy2</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
// import axios from 'axios'

export default {
  name: 'Mine',
  data() {
    return {}
  },
  setup() {
    const inputRef = ref(null)

    onMounted(() => {
      console.dir(inputRef.value)
      // async function getName(params) {
      //   console.log('aoliao', new Date().getSeconds())
      //   await getSleep()
      //   await setTimeout(() => {
      //     console.log('name2', new Date().getSeconds())
      //   }, 2000)
      // }
      // async function getSleep() {
      //   const res = await axios.get('/v1/token/sleep')
      //   console.log(res)
      // }
      // function getAge() {
      //   getName()
      //   Promise.resolve('aaa').then(res => {
      //     console.log(res)
      //   })
      //   console.log('age')
      // }
      // getAge()
    })

    function divClick() {
      console.log('divClick')
      inputRef.value.click()
    }

    function inputClick() {
      console.log('inputClick')
    }

    function submit() {
      console.log('submit')
    }

    const copyText = text => {
      //  ('我是文字2222')
      // 数字没有 .length 不能执行selectText 需要转化成字符串
      const textString = '我是文字2222' // text.toString()
      let input = document.querySelector('#copy-input')
      if (!input) {
        input = document.createElement('input')
        input.id = 'copy-input'
        input.readOnly = 'readOnly' // 防止ios聚焦触发键盘事件
        input.style.position = 'absolute'
        input.style.left = '-1000px'
        input.style.zIndex = '-1000'
        document.body.appendChild(input)
      }

      input.value = textString
      // ios必须先选中文字且不支持 input.select();
      selectText(input, 0, textString.length)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        alert('已复制到粘贴板')
      } else {
        console.log('不兼容')
      }
      input.blur()

      // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
      // 选择文本。createTextRange(setSelectionRange)是input方法
      function selectText(textbox, startIndex, stopIndex) {
        if (textbox.createTextRange) {
          // ie
          const range = textbox.createTextRange()
          range.collapse(true)
          range.moveStart('character', startIndex) // 起始光标
          range.moveEnd('character', stopIndex - startIndex) // 结束光标
          range.select() // 不兼容苹果
          console.log(456)
        } else {
          // firefox/chrome
          console.log(123)
          textbox.setSelectionRange(startIndex, stopIndex)
          textbox.focus()
        }
      }
    }

    return { inputRef, divClick, inputClick, submit, copyText }
  }
}
</script>

<style scoped lang="stylus">
.btn
  height 20px
  border: 1px solid #ff8d00
  box-shadow none
  background-color: #ff8d00
</style>
