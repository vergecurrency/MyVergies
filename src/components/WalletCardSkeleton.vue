<template>
  <div class="wallet-card-skeleton">
    <div class="wallet-card-skeleton-content">
      <b-skeleton height="15px" width="50%"/>
      <b-skeleton height="20px" width="85%"/>
      <b-skeleton height="12px" width="30%"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletCardSkeleton'
}
</script>

<style scoped>
  .wallet-card-skeleton {
    background: #ffffff;
    border-radius: 10px;
    height: 120px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 3px 0 #b0b0b0;
  }

  .wallet-card-skeleton-content {
    padding: 15px;
  }

  @media (prefers-color-scheme: dark) {
    .wallet-card-skeleton {
      background: #2c2c2c;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 3px 0 #111111;
    }
  }
</style>
