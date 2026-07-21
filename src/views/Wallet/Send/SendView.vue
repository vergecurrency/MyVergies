<template>
  <content-view
    :back="backLink"
    :title="$i18n.t('send.send')"
  >

    <template slot="section">
      <b-steps
        v-model="activeStep"
        size="is-small"
        :animated="false"
        :has-navigation="false"
      >

        <br/>

        <b-step-item :label="$i18n.t('send.fillForm')" :clickable="false">
          <send-form v-model="transaction" :wallet="wallet" :preparing="preparingTransaction" @input="validateTransaction"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('send.confirm')" :clickable="false">
          <send-confirm v-model="transaction" @confirmed="sendTransaction" @cancel="activeStep = 0"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('send.sending')" :clickable="false">
          <sending ref="sendingView"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('send.sent')" icon="check">
          <transaction-sent @send="reset" @next="goTo"/>
        </b-step-item>

      </b-steps>
    </template>

  </content-view>
</template>

<script>
import SendForm from '@/views/Wallet/Send/SendForm'
import Sending from '@/views/Wallet/Send/Sending'
import TransactionSent from '@/views/Wallet/Send/TransactionSent'
import SendConfirm from '@/views/Wallet/Send/SendConfirm'
import ContentView from '@/components/layout/ContentView'
import constants from '@/utils/constants'

export default {
  name: 'send-view',
  components: { ContentView, SendConfirm, TransactionSent, Sending, SendForm },
  data () {
    return {
      viewLocked: false,
      preparingTransaction: false,
      activeStep: 0,
      transaction: {
        toAddress: '',
        recipientLabel: '',
        resolvedDomain: '',
        resolvedAddress: '',
        amount: 0,
        message: '',
        txp: null
      }
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },
  computed: {
    supportsSending () {
      return !this.wallet.info || !this.wallet.info.wallet || this.wallet.info.wallet.supportsSending !== false
    },
    backLink () {
      return this.viewLocked ? null : {
        name: 'wallets',
        params: {
          walletIdentifier: this.wallet.identifier,
          wallet: this.wallet
        }
      }
    }
  },
  methods: {
    validateTransaction () {
      this.preparingTransaction = true

      const options = {
        outputs: [
          {
            toAddress: this.transaction.toAddress,
            amount: this.transaction.amount * constants.satoshiDivider
          }
        ],
        dryRun: false
      }

      this.wallet.createTxProposal(options).then(txp => {
        this.transaction.txp = txp
        this.activeStep = 1
      }).catch(e => {
        const key = `send.errors.${e.message}`
        const translatedMessage = this.$i18n.te(key) ? this.$i18n.t(key) : e.message

        this.$buefy.dialog.alert({
          message: translatedMessage
        })
      }).finally(() => {
        this.preparingTransaction = false
      })
    },

    sendTransaction () {
      this.viewLocked = true
      this.activeStep = 2

      this.wallet.publishTxProposal(this.transaction.txp).then(async txp => {
        this.$refs.sendingView.animate()

        const isElectrumxWallet = this.wallet &&
          this.wallet.info &&
          this.wallet.info.wallet &&
          this.wallet.info.wallet.backend === 'electrumx'
        const passphrase = isElectrumxWallet
          ? ''
          : await this.$walletManager.getWalletPassphrase(this.wallet)

        return this.wallet.signTxProposal(txp, passphrase)
      }).then(txp => {
        this.$refs.sendingView.animate()

        return this.wallet.broadcastTxProposal(txp)
      }).then(txp => {
        this.$refs.sendingView.animate()

        this.persistResolvedRecipient(txp)

        this.fetchTransaction()

        this.transaction.txp = txp
        this.viewLocked = false
        this.activeStep = 3
      }).catch(e => {
        this.handleSendFailure(e)
      })
    },

    async handleSendFailure (error) {
      const message = this.getSendErrorMessage(error)

      if (this.isMempoolConflict(error)) {
        await this.cleanupConflictingProposal()
        this.transaction.txp = null
        this.activeStep = 0
      }

      this.viewLocked = false

      this.$buefy.dialog.alert({
        message
      })
    },

    getSendErrorMessage (error) {
      const message = error && error.message ? error.message : String(error)

      if (this.isMempoolConflict(error)) {
        return this.$i18n.t('send.errors.MEMPOOL_CONFLICT')
      }

      return message
    },

    isMempoolConflict (error) {
      const message = error && error.message ? error.message : String(error)

      return /txn-mempool-conflict|code 18/i.test(message)
    },

    async cleanupConflictingProposal () {
      const txp = this.transaction.txp

      try {
        if (txp && this.wallet.removeTxProposal) {
          await this.wallet.removeTxProposal(txp)
        }
      } catch (e) {
        // The proposal may already be gone after a broadcast conflict. Continue with refresh.
      }

      const refreshTasks = [
        this.wallet.status && this.wallet.status(),
        this.wallet.fetchTxHistory && this.wallet.fetchTxHistory(),
        this.wallet.getTxProposals && this.wallet.getTxProposals()
      ].filter(Boolean)

      await Promise.allSettled(refreshTasks)
    },

    reset () {
      this.viewLocked = false
      this.activeStep = 0
      this.transaction = {
        toAddress: '',
        recipientLabel: '',
        resolvedDomain: '',
        resolvedAddress: '',
        amount: 0,
        message: '',
        txp: null
      }
      this.preparingTransaction = false
    },

    goTo (event) {
      if (this.activeStep !== 3) {
        return
      }

      this.$router.push({
        name: event.route,
        params: {
          walletIdentifier: this.wallet.identifier,
          wallet: this.wallet,
          txid: this.transaction.txp.txid
        }
      })
    },

    fetchTransaction () {
      setTimeout(async () => {
        await this.wallet.status()
        await this.wallet.fetchTxHistory()
      }, 2500)
    },

    persistResolvedRecipient (txp) {
      if (!txp || !txp.txid || !this.transaction.resolvedDomain) {
        return
      }

      this.$store.dispatch('saveResolvedRecipient', {
        txid: txp.txid,
        domain: this.transaction.resolvedDomain,
        address: this.transaction.resolvedAddress || this.transaction.toAddress
      })
    }
  }
}
</script>
