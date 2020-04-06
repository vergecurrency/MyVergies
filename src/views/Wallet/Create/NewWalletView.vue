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
