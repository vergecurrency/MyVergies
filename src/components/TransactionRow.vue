<template>
  <router-link :to="{ name: 'wallets.transactions', params: { walletIdentifier: wallet.identifier, txid: transaction.txid, transaction, wallet }}">
    <div class="transaction-container">
      <div class="transaction-icon">
        <b-icon v-if="transaction.action === 'received'" icon="plus-circle" type="is-success" class="fa-fw"/>
        <b-icon v-else-if="transaction.action === 'sent'" icon="minus-circle" type="is-danger"/>
        <b-icon v-else-if="transaction.action === 'moved'" icon="truck" class="has-text-grey-light fa-fw"/>
        <b-icon v-else-if="transaction.action === 'receiving'" icon="hourglass-half" class="has-text-grey-light fa-fw"/>
        <b-icon v-else-if="transaction.action === 'sending'" icon="satellite-dish" class="has-text-grey-light fa-fw"/>
        <b-icon v-else icon="question-circle" type="is-warning" class="fa-fw"/>
      </div>
      <div class="transaction-content">
        <div class="transaction-label">
          {{ label }}
        </div>
        <div class="transaction-timestamp">
          {{ timestamp }}
        </div>
      </div>
      <transaction-amount
        :amount="transaction.amount"
        :action="transaction.action"
        class="has-text-weight-bold"
        :class="['transaction-amount']"
      />
    </div>
  </router-link>
</template>

<script>
import moment from 'moment'
import TransactionAmount from '@/components/labels/TransactionAmount'

export default {
  name: 'TransactionRow',
  components: { TransactionAmount },
  props: {
    txid: {
      type: String,
      required: true
    },
    wallet: {
      type: Object,
      required: true
    }
  },
  computed: {
    transaction () {
      return this.wallet.transactions.find(tx => tx.txid === this.txid)
    },

    label () {
      const fallback = this.$i18n.t(`transaction.${this.transaction.action}`)
      const outputsWithAddress = this.transaction.outputs.filter(output => output.address !== 'false') || []

      if (this.transaction.action === 'sent' || this.transaction.action === 'sending') {
        return outputsWithAddress.shift().address || fallback
      }

      return fallback
    },

    timestamp () {
      return moment(this.transaction.time * 1000).locale(this.$electron.remote.app.getLocale()).format('lll')
    }
  }
}
</script>

<style scoped>
  .transaction-container {
    display: flex;
    padding: 1em;
    border-bottom: 1px solid #e8e8e8;
    align-items: center;
    background-color: white;
    transition: background-color 0.5s ease;
    cursor: pointer;
  }

  a:last-child .transaction-container {
    border-bottom: none;
  }

  .transaction-container:hover {
    background-color: #f6f6f6;
  }

  .transaction-icon {
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .transaction-content {
    margin: 0 1em;
    flex-grow: 1;
  }

  .transaction-label {
    font-weight: 600;
    color: #9f9f9f;
  }

  .transaction-timestamp {
    font-size: 0.75em;
    font-weight: 500;
    color: grey;
  }

  .transaction-amount {
    font-weight: 500;
  }

  @media (prefers-color-scheme: dark) {
    .transaction-container {
      background-color: #2c2e30;
      border-bottom: 1px solid #373737;
    }

    .transaction-container:hover {
      background-color: #252627;
    }
  }
</style>
