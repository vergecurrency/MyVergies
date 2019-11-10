<template>
  <div class="column" style="height: 100%">
    <div class="app-content-box">
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
    padding: 30px;
    overflow-y: auto;
    margin: auto;
  }
</style>
