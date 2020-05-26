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
    border: 2px dashed #e8e8e8;
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
    transition: all 0.5s ease-in-out;
  }
  .wallet-card-placeholder > small {
    font-size: .8rem;
    color: #727272;
  }
  .wallet-card-placeholder:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
</style>
