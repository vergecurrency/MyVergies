<template>
  <content-view title="Create new wallet" :back="{ name: 'wallets.create' }">

    <b-steps
      v-model="activeStep"
      size="is-small"
      :has-navigation="false"
    >

      <br/>

      <b-step-item :label="$i18n.t('createWallet.preferences')" :clickable="false">
        <wallet-preferences :wallet="wallet" @next="next"/>
      </b-step-item>

      <b-step-item :label="$i18n.t('createWallet.paperKey')" :clickable="false">
        <paper-key @next="next"/>
      </b-step-item>

      <b-step-item :label="$i18n.t('createWallet.confirmPaperKey')" :clickable="false">
        <wallet-preferences :wallet="wallet" @next="next"/>
      </b-step-item>

      <b-step-item :label="$i18n.t('createWallet.passPhrase')" :clickable="false">
        <wallet-preferences :wallet="wallet" @next="next"/>
      </b-step-item>

      <b-step-item :label="$i18n.t('createWallet.walletCreated')" :clickable="false">
        <wallet-preferences :wallet="wallet" @next="next"/>
      </b-step-item>

    </b-steps>

  </content-view>
</template>

<script>
import ContentView from '@/components/layout/ContentView'
import WalletPreferences from '@/views/Wallet/Create/WalletPreferences'
import PaperKey from '@/views/Wallet/Create/PaperKey'

export default {
  name: 'NewWalletView',
  components: { PaperKey, WalletPreferences, ContentView },
  data () {
    return {
      activeStep: 0,
      wallet: {
        name: '',
        color: 'red',
        amount: 1234567.89
      }
    }
  },
  methods: {
    next () {
      this.activeStep++
    }
  }
}
</script>
