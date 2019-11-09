<template>
  <div class="modal-card has-border-radius" :class="modalCardShadow">
    <div class="modal-content">
      <div class="box">
        <div class="columns is-vcentered">
          <div class="column">
            <div class="tags has-addons">
              <span class="tag is-medium">transaction</span>
              <span class="tag is-medium is-capitalized" :class="tagColor" v-html="transaction.action" />
            </div>
          </div>
          <div class="column has-text-right">
            <a v-if="transaction.action === 'sent'" class="button is-rounded">
              <FaIcon icon="redo"/>
            </a>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            Amount
            <TransactionAmount
              class="is-size-4 has-text-weight-bold"
              :amount="transaction.amount"
              :action="transaction.action"
            />
          </div>
          <div class="column">
            Date
            <p class="is-size-4 has-text-weight-semibold has-text-primary">{{ timestamp }}</p>
          </div>
        </div>

        <p>Details</p>

        <div v-if="address" class="notification">
          <div class="columns is-vcentered">
            <div class="column">
              <p class="has-text-weight-semibold">Address</p>
              <p v-html="address"/>
            </div>
            <div class="column has-text-right">
              <a class="button is-rounded is-small">
                <FaIcon icon="info"/>
              </a>
            </div>
          </div>
        </div>

        <div class="notification">
          <p class="has-text-weight-semibold">Confirmations</p>
          <p v-html="transaction.confirmations"/>
        </div>

        <div class="notification">
          <div class="columns is-vcentered">
            <div class="column is-10">
              <p class="has-text-weight-semibold">TXID</p>
              <p class="has-text-txid" v-html="transaction.txid"/>
            </div>
            <div class="column has-text-right">
              <a class="button is-rounded is-small">
                <FaIcon icon="info"/>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import TransactionAmount from '@/components/labels/TransactionAmount'

export default {
  name: 'TransactionDetailsModal',
  components: { TransactionAmount },
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },
  computed: {
    address () {
      let outputsWithAddress = this.transaction.outputs.filter(output => output.address !== 'false') || []

      return outputsWithAddress.shift().address || null
    },

    label () {
      let fallback = this.transaction.action

      if (this.transaction.action === 'sent') {
        return this.address || fallback
      }

      return fallback
    },

    timestamp () {
      return moment(this.transaction.time * 1000).locale(this.$electron.remote.app.getLocale()).format('lll')
    },

    tagColor () {
      switch (this.transaction.action) {
        case 'sent':
          return 'is-danger'
        case 'received':
          return 'is-success'
        case 'moved':
        default:
          return 'is-dark'
      }
    },

    modalCardShadow () {
      switch (this.transaction.action) {
        case 'sent':
          return 'has-shadow-danger'
        case 'received':
          return 'has-shadow-success'
        case 'moved':
        default:
          return 'has-shadow-dark'
      }
    }
  }
}
</script>

<style scoped>
  .has-text-txid {
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
