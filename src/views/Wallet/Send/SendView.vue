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
          <send-form v-model="transaction" @input="validateTransaction"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('send.confirm')" :clickable="false">
          <send-confirm v-model="transaction" @confirmed="sendTransaction" @cancel="activeStep = 0"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('send.sending')" :clickable="false">
          <sending ref="sendingView" @sent="transactionSent"/>
        </b-step-item>

        <b-step-item :label="$i18n.t('send.sent')" icon="check">
          <transaction-sent @done="reset"/>
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

export default {
  name: 'send-view',
  components: { ContentView, SendConfirm, TransactionSent, Sending, SendForm },
  data () {
    return {
      viewLocked: false,
      activeStep: 0,
      transaction: {
        recipient: 'DBn4ZuRme7bjtN85y3hJ4K2AWC8hhDNcsm',
        amount: 0,
        memo: ''
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
    backLink () {
      return this.viewLocked ? null : {
        name: 'wallets',
        params: {
          walletName: this.wallet.name,
          wallet: this.wallet
        }
      }
    }
  },
  methods: {
    validateTransaction () {
      this.activeStep = 1
    },

    sendTransaction () {
      this.viewLocked = true
      this.$refs.sendingView.animate()
      this.activeStep = 2
    },

    transactionSent () {
      this.viewLocked = false
      this.activeStep = 3
    },

    reset () {
      this.viewLocked = false
      this.activeStep = 0
    }
  }
}
</script>
