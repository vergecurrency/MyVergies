<template>
  <div>
    <div class="box">
      <div :class="walletHeaderBoxClass">
        <div class="wallet-header-background"/>
        <div class="wallet-header-background-overlay-gradient"/>
        <div class="wallet-header-content">
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
    },
    walletHeaderBoxClass () {
      return [
        'wallet-header-box',
        'wallet-header-box-background-' + this.wallet.color
      ].join(' ')
    }
  },
  methods: {
    editWallet () {
      this.$buefy.toast.open('Something happened')
    }
  }
}
</script>

<style>
.wallet-header-box {
  display: grid;
  grid-template-columns: 1;
  grid-template-rows: 1;
  margin: -1.25rem;
  border-radius: 5px;
  overflow: hidden;
}

.wallet-header-box-background-blue {
  background: rgb(27,154,220);
  background: linear-gradient(145deg, rgb(0, 30, 220) 50%, rgb(14, 149, 202) 70%, rgb(117, 240, 236) 100%);
}

.wallet-header-box-background-purple {
  background: rgb(90,0,188);
  background: linear-gradient(145deg, rgb(90, 0, 188) 50%, rgb(228, 62, 120) 100%);
}

.wallet-header-box-background-green {
  background: rgb(27,138,117);
  background: linear-gradient(145deg, rgb(0, 155, 94) 50%, rgb(217, 255, 51) 100%);
}

.wallet-header-box-background-orange {
  background: rgb(188,76,0);
  background: linear-gradient(145deg, rgb(188, 76, 0) 50%, rgb(254, 255, 29) 100%);
}

.wallet-header-box-background-red {
  background: rgb(188,0,89);
  background: linear-gradient(145deg, rgb(188, 0, 89) 50%, rgb(228, 181, 62) 100%);
}

.wallet-header-background {
  grid-area: 1 / 1;
  mix-blend-mode: overlay;
}

.wallet-header-background.xvg {
  background: url('~@/assets/coins/xvg.svg') no-repeat right;
}

.wallet-header-background.btc {
  background: url('~@/assets/coins/btc.svg') no-repeat right;
}

.wallet-header-background-overlay-gradient {
  background: linear-gradient(250deg, #ffffff00 40%, white 40%);
  grid-area: 1 / 1;
  z-index: 1;
}

.wallet-header-content {
  grid-area: 1 / 1;
  padding: 1.25rem;
  z-index: 2;
}

@media (prefers-color-scheme: dark) {
  .wallet-header-background-overlay-gradient {
    background: linear-gradient(250deg, #2c2e3000 40%, #2c2e30 40%);
  }
}
</style>
