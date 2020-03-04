<template>
  <content-view title="Create new wallet" :back="{ name: 'wallets.create' }">

    <template slot="section">
      <b-steps
        v-model="activeStep"
        size="is-small"
        :animated="false"
        :has-navigation="false"
        class="step-content-box"
      >

        <br/>

        <b-step-item :label="$i18n.t('createWallet.preferences')" :clickable="false" class="section">
          <wallet-preferences :wallet="wallet" @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.paperKey')" :clickable="false" class="section">
          <paper-key @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.passPhrase')" :clickable="false" class="section">
          <pass-phrase @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.walletCreated')" :clickable="false" class="section">
          <wallet-preferences :wallet="wallet" @next="next"/>
        </b-step-item>

      </b-steps>
    </template>

  </content-view>
</template>

<script>
import ContentView from '@/components/layout/ContentView'
import WalletPreferences from '@/views/Wallet/Create/WalletPreferences'
import PaperKey from '@/views/Wallet/Create/PaperKey'
import PassPhrase from '@/views/Wallet/Create/PassPhrase'

export default {
  name: 'NewWalletView',
  components: { PassPhrase, PaperKey, WalletPreferences, ContentView },
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

<style>
.step-content-box > .step-content {
  border-radius: 0.5em;
  margin-top: 1em;
  background-color: rgba(0, 0, 0, 0.02);
}
.step-content-box > .step-content > .section {
  padding: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  .step-content-box > .step-content {
    background-color: rgba(0, 0, 0, 0.15);
  }
}
</style>
