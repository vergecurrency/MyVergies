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

        <b-step-item :label="$i18n.t('createWallet.preferences')" class="section">
          <wallet-preferences :wallet="wallet" @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.paperKey')" class="section">
          <paper-key @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.passPhrase')" class="section">
          <pass-phrase @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.walletCreated')" class="section">
          <created @next="next"/>
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
import Created from '@/views/Wallet/Create/Created'

export default {
  name: 'NewWalletView',
  components: { Created, PassPhrase, PaperKey, WalletPreferences, ContentView },
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
.step-content-box > .step-content > .section {
  padding: 1.5rem;
}

.step-content-box > .step-content {
  border-radius: 0.5em;
  margin-top: 1em;
  background-color: #fdfdfd;
  border: 1px solid #e9e9e9;
  box-shadow: 0 0 0.5rem 0 #00000017;
}

@media (prefers-color-scheme: dark) {
  .step-content-box > .step-content {
    border: 1px solid #434343;
    background-color: #262729;
  }
}
</style>
