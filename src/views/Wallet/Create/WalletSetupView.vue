<template>
  <content-view
    :title="$i18n.t(restore ? 'createWallet.restoreExistingWallet' : 'createWallet.createNewWallet')"
    :back="{ name: 'wallets.create' }"
  >

    <template slot="section">
      <b-steps
        v-model="activeStep"
        size="is-small"
        :animated="false"
        :has-navigation="false"
      >

        <br/>

        <b-step-item :label="$i18n.t('createWallet.preferences')" :clickable="false">
          <wallet-preferences :wallet="wallet" @next="next" :restore="restore"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.paperKey')" :clickable="false">
          <paper-key :wallet="wallet" @next="next" :restore="restore"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.passPhrase')" :clickable="false">
          <pass-phrase :wallet="wallet" @next="next"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('createWallet.createWallet')" :clickable="false">
          <create :wallet="createdWallet" :done="createdWallet !== null" @createWallet="createWallet" @next="walletCreated"/>
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
import Create from '@/views/Wallet/Create/Create'
import constants from '@/utils/constants'

export default {
  name: 'WalletSetupView',
  components: { Create, PassPhrase, PaperKey, WalletPreferences, ContentView },
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
        vwsApi: constants.vwsApi,
        info: {
          balance: {
            totalAmount: 12300000000
          }
        }
      },
      createdWallet: null
    }
  },
  props: {
    restore: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    next () {
      this.activeStep++
    },

    createWallet () {
      this.$walletManager.addWallet(this.wallet).then(wallet => {
        this.$store.dispatch('addWalletName', this.wallet.name)

        this.createdWallet = wallet
      }).catch(error => {
        this.$buefy.dialog.alert({
          message: error.toString(),
          onConfirm: () => {
            // decide what to do.
          }
        })
      })
    },

    walletCreated (event) {
      this.$router.push({ name: event.route, params: { walletName: this.wallet.name, wallet: this.createdWallet } })
    }
  }
}
</script>
