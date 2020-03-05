<template>
  <div class="header-image">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'PageTitle'
}
</script>

<style>
  .header-image > img {
    width: 400px;
  }
</style>
