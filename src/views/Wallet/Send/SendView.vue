<template>
  <content-view
    :back="backLink"
    :title="$i18n.t('send.send')"
    class="send-view-remove-padding-bottom"
  >

    <template slot="box-header">
      <info-notification>
        <template slot="title">
          Sending XVG is easy!
        </template>
        <template slot="subtitle">
          Fill in the form with a recipient address and an amount and confirm the transaction.
        </template>
        <template slot="content">
          Additionally you can fill the memo field which will only visible by you.<br/>
          You could use it for example like a reminder what the transaction was about.
        </template>
      </info-notification>
    </template>

    <template slot="section">
      <b-steps
        v-model="activeStep"
        size="is-small"
        :has-navigation="false"
        class="step-content-box"
      >

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
import InfoNotification from '@/components/InfoNotification'
import SendForm from '@/views/Wallet/Send/SendForm'
import Sending from '@/views/Wallet/Send/Sending'
import TransactionSent from '@/views/Wallet/Send/TransactionSent'
import SendConfirm from '@/views/Wallet/Send/SendConfirm'
import ContentView from '@/components/layout/ContentView'

export default {
  name: 'send-view',
  components: { ContentView, SendConfirm, TransactionSent, Sending, SendForm, InfoNotification },
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

<style>
  .send-view-remove-padding-bottom > .box > .section {
    padding-bottom: 0;
  }
</style>
