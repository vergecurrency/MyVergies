<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" title="Send"/>

    <div class="box">

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

      <section class="section">

        <b-steps
          v-model="activeStep"
          :has-navigation="false"
        >

          <b-step-item label="Fill Form">
            <send-form v-model="transaction" @input="validateTransaction"/>
          </b-step-item>

          <b-step-item label="Confirm">
            <send-confirm v-model="transaction" @confirmed="sendTransaction"/>
          </b-step-item>

          <b-step-item label="Sending">
            <sending ref="sendingView" @sent="transactionSent"/>
          </b-step-item>

          <b-step-item label="Sent" type="is-success" icon="check">
            <transaction-sent @done="reset"/>
          </b-step-item>

        </b-steps>

      </section>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import InfoNotification from '@/components/InfoNotification'
import SendForm from '@/components/Sending/SendForm'
import Sending from '@/components/Sending/Sending'
import TransactionSent from '@/components/Sending/TransactionSent'
import SendConfirm from '@/components/Sending/SendConfirm'
export default {
  name: 'send-view',
  components: { SendConfirm, TransactionSent, Sending, SendForm, InfoNotification, NavigationHeader },
  data () {
    return {
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
  methods: {
    validateTransaction () {
      this.activeStep = 1
    },

    sendTransaction () {
      this.$refs.sendingView.animate()
      this.activeStep = 2
    },

    transactionSent () {
      this.activeStep = 3
    },

    reset () {
      this.activeStep = 0
    }
  }
}
</script>
