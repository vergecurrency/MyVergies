<template>
  <div class="has-text-centered">
    <h1 class="title">Transaction Sent!</h1>
    Lorem ipsum dolor sit amet.
    <br/>

    <button class="button is-primary" @click="$emit('done')">
      Done
    </button>
  </div>
</template>

<script>
export default {
  name: 'TransactionSent'
}
</script>
