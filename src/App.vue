<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import MHeader from '@components/m-header/index'
import MTab from '@components/m-tab/index'

export default {
  name: 'App',
  components: {
    MHeader,
    MTab
  }
}
</script>
