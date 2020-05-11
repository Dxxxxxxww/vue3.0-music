<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
// @ is an alias to /src
import MHeader from './views/header/index'
import MTab from './views/tab/index'

export default {
  name: 'App',
  components: {
    MHeader,
    MTab
  }
}
</script>
