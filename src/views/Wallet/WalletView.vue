<template>
  <div>
    <div class="box">
      <div class="columns is-vcentered">
        <div class="column is-narrow">
          <p class="is-size-3 is-family-handwritten is-capitalized has-text-grey has-line-height-small">
            {{ wallet.name }}
          </p>
          <money class="is-size-3 has-text-weight-dark" :amount="wallet.info.balance.totalAmount || 0" crypto/>
          <money class="is-size-6 has-text-grey has-text-weight-semibold has-line-height-small" :amount="wallet.info.balance.totalAmount || 0" convert/>
        </div>
        <div class="column is-narrow">
          <router-link
            :to="{ name: 'wallets.settings', params: { walletIdentifier: wallet.identifier, wallet }}"
            class="button is-light is-rounded"
          >
            <span class="icon has-text-grey-dark">
              <b-icon icon="cog" size="is-small"/>
            </span>
          </router-link>
        </div>
        <div class="column">
          <div class="is-pulled-right">
            <div class="columns">
              <div class="column">
                <div class="buttons">
                  <router-link
                    :to="{ name: 'wallets.send', params: { walletIdentifier: wallet.identifier, wallet }}"
                    class="button is-primary"
                  >
                    <span class="icon">
                        <b-icon icon="credit-card" size="is-small"/>
                    </span>
                    <span v-html="$i18n.t('wallet.send')"/>
                  </router-link>
                  <router-link
                    :to="{ name: 'wallets.receive', params: { walletIdentifier: wallet.identifier, wallet }}"
                    class="button is-primary"
                  >
                    <span class="icon">
                        <b-icon icon="hand-holding-usd" size="is-small"/>
                    </span>
                    <span v-html="$i18n.t('wallet.receive')"/>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasTransactions" class="box is-paddingless is-clipped">
      <transaction-row
        v-for="transaction in transactions"
        :key="transaction.txid"
        :txid="transaction.txid"
        :wallet="wallet"
      />
    </div>
    <div v-else class="box section has-text-centered">
      <b-icon icon="list-ul" size="is-large"/>
      <h4 class="title is-4" v-html="$i18n.t('wallet.noTransactions')"/>
      <p class="subtitle" v-html="$i18n.t('wallet.noTransactionsDesc')"/>
    </div>
  </div>
</template>

<script>
import TransactionRow from '@/components/TransactionRow'
import Money from '@/components/labels/Money'

export default {
  name: 'wallet-view',
  components: { TransactionRow, Money },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },
  computed: {
    transactions () {
      return this.wallet.transactions || []
    },
    hasTransactions () {
      return this.wallet && this.wallet.transactions && this.wallet.transactions.length > 0
    }
  },
  methods: {
    editWallet () {
      this.$buefy.toast.open('Something happened')
    }
  }
}
</script>

<style scoped>

</style>
