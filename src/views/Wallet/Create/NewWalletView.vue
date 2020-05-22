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
          <paper-key :wallet="wallet" @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.passPhrase')" class="section">
          <pass-phrase :wallet="wallet" @next="createWallet"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.createWallet')" class="section">
          <created :wallet="wallet" :done="createdWallet !== null" @next="toWallet"/>
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
        color: 'blue',
        coin: 'xvg',
        network: 'livenet',
        paperkey: '',
        passphrase: '',
        singleAddress: false,
        vwsApi: 'http://localhost:3232/vws/api',
        info: {
          balance: {
            totalAmount: 12300000000
          }
        }
      },
      createdWallet: null
    }
  },
  methods: {
    next () {
      this.activeStep++
    },

    createWallet () {
      this.next()

      this.$walletManager.addWallet(this.wallet).then(wallet => {
        this.$store.dispatch('addWalletName', this.wallet.name)

        this.createdWallet = wallet
      })
      //   .catch(error => {
      //   // TODO
      //   console.error(error)
      // })
    },

    toWallet () {
      this.$router.push({ name: 'wallets', params: { walletName: this.wallet.name, wallet: this.createdWallet } })
    }
  }
}
</script>
