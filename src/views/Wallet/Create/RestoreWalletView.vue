<template>
  <content-view title="Restore new wallet" :back="{ name: 'wallets.create' }">
    Restore
  </content-view>
</template>

<script>
import ContentView from '@/components/layout/ContentView'

export default {
  name: 'RestoreWalletView',
  components: { ContentView }
}
</script>

<style scoped>

</style>
