<template>
  <div class="wallet-card-placeholder">
    <p class="is-family-handwritten" v-t="'createWallet.addYourFirstWallet'"/>
    <small v-t="'createWallet.itsReallyEasy'"/>
  </div>
</template>

<script>
export default {
  name: 'WalletCardPlaceholder'
}
</script>

<style scoped>
  .wallet-card-placeholder {
    border: 2px dashed #c7c7c7;
    border-radius: 10px;
    padding: 10px;
    height: 120px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: #a2a2a2;
  }
  .wallet-card-placeholder > small {
    font-size: .8rem;
    color: #727272;
  }
</style>
