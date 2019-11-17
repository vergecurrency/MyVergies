<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" title="Wallet Settings"/>

    <div class="box">
      Wallet Settings
    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'

export default {
  name: 'wallet-settings-view',
  components: { NavigationHeader },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
