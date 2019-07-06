<template>
  <div class="columns has-text-centered is-vcentered add-wallet-container">
    <div class="column">
      <p class="is-size-3 has-text-weight-bold has-text-grey-dark">Add a new wallet</p>
      <p>Create a new or restore an existing wallet to Verge Electron.</p>
      <div class="section">
        <div class="buttons is-centered">
          <a class="button is-primary">
            Create a new wallet
          </a>
          <a class="button">
            Restore a wallet
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AddWallet'
  }
</script>

<style scoped>
  .add-wallet-container {
    border-top: 1px solid #e8e8e8;
    height: 100%;
  }
</style>
