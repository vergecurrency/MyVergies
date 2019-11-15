<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" title="Receive"/>

    <div class="box">
      When QR code?
    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
export default {
  name: 'receive-view',
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
