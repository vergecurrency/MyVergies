<template>
  <router-link :to="{ name: 'wallets.transactions', params: { walletName: wallet.name, txid: transaction.txid, transaction, wallet }}">
    <div class="transaction-container">
      <div class="transaction-icon">
        <img :src="icon"/>
      </div>
      <div class="transaction-content">
        <div class="transaction-label">
          {{ label }}
        </div>
        <div class="transaction-timestamp">
          {{ timestamp }}
        </div>
      </div>
      <transaction-amount :amount="transaction.amount" :action="transaction.action" :class="['transaction-amount']" />
    </div>
  </router-link>
</template>

<script>
import moment from 'moment'
import sentIcon from '@/assets/icons/sent.svg'
import receivedIcon from '@/assets/icons/received.svg'
import sendingIcon from '@/assets/icons/sending.svg'
import movedIcon from '@/assets/icons/moved.svg'
import receivingIcon from '@/assets/icons/receiving.svg'
import TransactionAmount from '@/components/labels/TransactionAmount'

const icons = {
  sentIcon,
  sendingIcon,
  receivedIcon,
  receivingIcon,
  movedIcon
}

export default {
  name: 'TransactionRow',
  components: { TransactionAmount },
  props: {
    transaction: {
      type: Object,
      required: true
    },
    wallet: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon () {
      return icons[`${this.transaction.action}Icon`]
    },

    label () {
      let fallback = this.transaction.action
      let outputsWithAddress = this.transaction.outputs.filter(output => output.address !== 'false') || []

      if (this.transaction.action === 'sent') {
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

  .transaction-icon > img {
    width: 15px;
    height: 15px;
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
