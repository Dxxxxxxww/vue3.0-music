<template>
  <div id="app">
    <!-- <m-header></m-header> -->
    <m-tab></m-tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
// @ is an alias to /src
// import MHeader from './views/header/index'
import MTab from './views/tab/index'
import Player from './views/player/Player'

export default {
  name: 'App',
  components: {
    // MHeader,
    MTab,
    Player
  }
}
</script>
