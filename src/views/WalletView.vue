<template>
  <div>
    <div class="box">
      <div class="columns is-vcentered">
        <div class="column">
          <p
            class="is-size-5 has-text-weight-semibold is-capitalized has-text-grey has-line-height-small"
            v-html="wallet.name"
          />
          <Money class="is-size-3 has-text-weight-dark" :amount="wallet.amount" crypto/>
          <Money class="is-size-6 has-text-grey has-text-weight-semibold has-line-height-small" :amount="wallet.amount" convert/>
        </div>
        <div class="column">
          <div class="is-pulled-right">
            <div class="columns">
              <div class="column">
                <div class="buttons">
                  <a @click="editWallet" class="button is-text">
                    <span class="icon has-text-grey-dark">
                      <FaIcon icon="edit" />
                    </span>
                  </a>
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
import TransactionRow from '@/components/TransactionRow'
import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal'
import TxHistory from '@/assets/data/example/txHistory'
import Money from '@/components/labels/Money'

export default {
  name: 'WalletView',
  components: { TransactionRow, Money },
  data () {
    return {
      transactions: TxHistory
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },
  methods: {
    editWallet () {
      this.$buefy.toast.open('Something happened')
    },

    openTransaction (transaction) {
      this.$buefy.modal.open({
        parent: this,
        component: TransactionDetailsModal,
        hasModalCard: true,
        canCancel: ['escape', 'outside'],
        props: {
          transaction
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
