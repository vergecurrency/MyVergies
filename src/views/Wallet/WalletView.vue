<template>
  <div>
    <div class="box">
      <div class="columns is-vcentered">
        <div class="column">
          <p
            class="is-size-3 is-family-handwritten is-capitalized has-text-grey has-line-height-small"
            v-html="wallet.name"
          />
          <money class="is-size-3 has-text-weight-dark" :amount="wallet.info.balance.totalAmount || 0" crypto/>
          <money class="is-size-6 has-text-grey has-text-weight-semibold has-line-height-small" :amount="wallet.info.balance.totalAmount || 0" convert/>
        </div>
        <div class="column">
          <div class="is-pulled-right">
            <div class="columns">
              <div class="column">
                <div class="buttons">
                  <router-link
                    :to="{ name: 'wallets.settings', params: { walletName: wallet.name, wallet }}"
                    class="button is-text"
                  >
                    <span class="icon has-text-grey-dark">
                      <b-icon icon="edit" size="is-small"/>
                    </span>
                  </router-link>
                  <router-link
                    :to="{ name: 'wallets.send', params: { walletName: wallet.name, wallet }}"
                    class="button is-primary"
                  >
                    <span class="icon">
                        <b-icon icon="credit-card" size="is-small"/>
                    </span>
                    <span v-html="$i18n.t('wallet.send')"/>
                  </router-link>
                  <router-link
                    :to="{ name: 'wallets.receive', params: { walletName: wallet.name, wallet }}"
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
    <div class="box is-paddingless is-clipped">
      <transaction-row
        v-for="transaction in transactions"
        :key="transaction.txid"
        :txid="transaction.txid"
        :wallet="wallet"
      />
    </div>
  </div>
</template>

<script>
import TransactionRow from '@/components/TransactionRow'
import Money from '@/components/labels/Money'

export default {
  name: 'WalletView',
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
