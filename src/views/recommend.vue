<template>
  <div></div>
</template>

<script>
import { getRecommend } from '../service/recommend'

export default {
  name: 'recommend',
  data() {
    return {}
  },
  created() {
    getRecommend()
  }
}
</script>

<style scoped lang="scss"></style>
