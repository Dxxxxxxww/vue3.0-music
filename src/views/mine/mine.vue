<template>
  <div>
    我的
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Mine',
  data() {
    return {}
  },
  async mounted() {
    console.log('start')
    async function getName(params) {
      console.log('aoliao', new Date().getSeconds())
      // await async2()
      await getSleep()
      // await setTimeout(() => {
      //   console.log('name', new Date().getSeconds())
      // }, 12000)
      console.log('wahaha')
      console.log('jianlibao', new Date().getSeconds())
      await setTimeout(() => {
        console.log('name2', new Date().getSeconds())
      }, 2000)
    }
    async function getSleep() {
      const res = await axios.get('/v1/token/sleep')
      console.log(res)
    }
    function getAge() {
      getName()
      Promise.resolve('aaa').then(res => {
        console.log(res)
      })
      console.log('age')
    }
    getAge()
  }
}
</script>

<style scoped lang="scss"></style>
