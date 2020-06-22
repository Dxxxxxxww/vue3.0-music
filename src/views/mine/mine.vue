<template>
  <div>
    <form action="" @scroll="submit"></form>
    <div class="btn" @click="divClick">
      <input ref="inputRef" type="submit" @click.stop="inputClick" />
    </div>
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

    return { inputRef, divClick, inputClick, submit }
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
