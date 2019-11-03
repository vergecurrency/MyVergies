<template>
  <div class="transaction-container" @click.capture="$emit('click')">
    <div class="transaction-icon">
      <img :src="`static/icons/${transaction.action}.svg`"/>
    </div>
    <div class="transaction-content">
      <div class="transaction-label">
        {{ label }}
      </div>
      <div class="transaction-timestamp">
        {{ timestamp }}
      </div>
    </div>
    <div :class="['transaction-amount', amountColor]">
      {{ amount }}
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { remote } from 'electron'
  import { formatAmountFromSatoshis } from './Money'

  export default {
    name: 'TransactionRow',
    props: {
      transaction: {
        type: Object,
        required: true
      }
    },
    computed: {
      label () {
        let fallback = this.transaction.action
        let outputsWithAddress = this.transaction.outputs.filter(output => output.address !== 'false') || []

        if (this.transaction.action === 'sent') {
          return outputsWithAddress.shift().address || fallback
        }

        return fallback
      },

      timestamp () {
        return moment(this.transaction.time * 1000).lang(remote.app.getLocale()).format('lll')
      },

      amount () {
        let amount = formatAmountFromSatoshis(this.transaction.amount, remote.app.getLocale())

        switch (this.transaction.action) {
          case 'sent':
            return `- ${amount}`
          case 'received':
            return `+ ${amount}`
          case 'moved':
          default:
            return amount
        }
      },

      amountColor () {
        switch (this.transaction.action) {
          case 'sent':
            return 'has-text-danger'
          case 'received':
            return 'has-text-success'
          case 'moved':
          default:
            return 'has-text-grey-light'
        }
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

  .transaction-container:last-child {
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
      background-color: #151515;
      border-bottom: 1px solid #373737;
    }

    .transaction-container:hover {
      background-color: #272727;
    }
  }
</style>
