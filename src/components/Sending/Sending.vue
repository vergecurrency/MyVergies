<template>
  <div class="has-text-centered">
    <h1 class="title">Sending Transaction</h1>
    Lets wait a few seconds...
  </div>
</template>

<script>
export default {
  name: 'Sending',
  methods: {
    animate () {
      setTimeout(() => {
        this.$emit('sent')
      }, 2500)
    }
  }
}
</script>
