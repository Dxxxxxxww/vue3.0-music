<template>
  <div></div>
</template>

<script>
export default {
  name: '',
  props: {
    fixed: Number
  },
  data() {
    return {}
  },
  created() {
    setTimeout(() => {
      console.log(this.fixed)
    }, 3000)
  }
}
</script>

<style scoped lang="stylus"></style>
