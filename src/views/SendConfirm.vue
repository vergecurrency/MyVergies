<template>
  <div class="has-text-centered">
    <h1 class="title">Confirm Transaction</h1>
    Lorem ipsum dolor sit amet.
    <br/>
    <button class="button is-primary" @click="$emit('confirmed')">
      Confirm
    </button>
  </div>
</template>

<script>
export default {
  name: 'SendConfirm'
}
</script>
