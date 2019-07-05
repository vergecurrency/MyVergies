<template>
  <div class="column">
    <div class="box is-paddingless is-clipped app-content-box">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContentContainer'
  }
</script>

<style>
  .app-content-box {
    height: 100%;
    border-top-right-radius: 0!important;
    border-bottom-right-radius: 0!important;
  }
</style>
