<template>
  <div class="column">
    <div class="is-paddingless is-clipped app-content-box">
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
  }
</style>
