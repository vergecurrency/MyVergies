<template>
  <div>
    <div class="box">
      <div class="columns">
        <div class="column">
          <p class="is-uppercase is-size-5 has-text-weight-semibold">Main Account</p>
          <p class="is-size-3 has-text-weight-bold">1.434.534,53 XVG</p>
          <p class="is-size-6">€ 10.323,43</p>
        </div>
        <div class="column">
          <div class="is-pulled-right">
            <div class="columns">
              <div class="column">
                <div class="buttons is-right">
                  <a class="button is-light is-rounded">
                    <span class="icon has-text-grey-dark">
                      <FaIcon icon="edit" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <a class="button is-primary">
                  <span class="icon">
                      <FaIcon icon="credit-card" />
                  </span>
                  <span>
                    Send
                  </span>
                </a>
                <a class="button is-primary">
                  <span class="icon">
                      <FaIcon icon="hand-holding-usd" />
                  </span>
                  <span>
                    Receive
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box is-paddingless is-clipped">
      <TransactionRow
        v-for="transaction in transactions"
        :key="transaction.txid"
        :transaction="transaction"
        @click="openTransaction(transaction)"
      />
    </div>
  </div>
</template>

<script>
  import TransactionRow from './TransactionRow'
  import TransactionDetailsModal from './modals/TransactionDetailsModal'
  import TxHistory from './../assets/data/example/txHistory'

  export default {
    name: 'WalletView',
    components: {TransactionRow},
    data () {
      return {
        transactions: TxHistory
      }
    },
    methods: {
      openTransaction (transaction) {
        this.$modal.open({
          parent: this,
          component: TransactionDetailsModal,
          hasModalCard: true,
          canCancel: ['escape', 'outside']
        })
      }
    }
  }
</script>

<style scoped>

</style>
