<template>
  <div id="app">
    <NavBar/>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavBar from './components/layout/NavBar'

  export default {
    name: 'when-wallet',
    components: {NavBar}
  }
</script>

<style>
  /* CSS */
</style>
