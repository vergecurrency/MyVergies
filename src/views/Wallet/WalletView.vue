<template>
  <div>

    <b-notification
      v-if="this.wallet.txProposals.length > 0"
      type="is-warning"
      icon="exclamation-triangle"
      has-icon
      :closable="false"
    >
      <div class="columns is-vcentered">
        <div class="column">
          <p class="has-text-weight-bold" v-html="$i18n.t('wallet.invalidBalance')"/>
          <p v-html="$i18n.t('wallet.invalidBalanceDesc', { txps: this.wallet.txProposals.length })" />
        </div>
        <div class="column is-narrow">
          <b-button label="Resolve issue" type="is-success" @click="resolveTxProposalIssues" />
        </div>
      </div>
    </b-notification>

    <div class="box">
      <div :class="walletHeaderBoxClass">
        <div
          class="wallet-header-background"
          :style="{ backgroundImage: `url(${require(`@/assets/coins/${walletCoin}.svg`)})` }"
        />
        <div class="wallet-header-grid"/>
        <div class="wallet-header-horizon"/>
        <div class="wallet-header-background-overlay-gradient"/>
        <div class="wallet-header-content">
          <div class="columns is-vcentered">
            <div class="column is-narrow">
              <p class="is-size-3 is-family-display is-capitalized has-text-grey has-line-height-small wallet-header-title">
                {{ wallet.name }}
              </p>
              <p>
                <money class="is-size-3 has-text-weight-dark" :amount="walletTotalAmount" crypto/>
              </p>
              <p>
                <money class="is-size-6 has-text-grey has-text-weight-semibold has-line-height-small" :amount="walletTotalAmount" convert/>
              </p>
              <div v-if="isVwsWallet" class="wallet-vws-status">
                <span class="wallet-vws-status-label">VWS API</span>
                <span :class="['wallet-vws-status-value', vwsStatusClass]">{{ vwsStatusLabel }}</span>
              </div>
              <b-switch
                v-if="hasAddressBalances"
                v-model="showAddressBalances"
                size="is-small"
                class="wallet-address-balance-toggle"
              >
                {{ $i18n.t('wallet.showAddressBalances') }}
              </b-switch>
              <div v-if="isElectrumxWallet" class="wallet-electrum-status">
                <span :class="['wallet-electrum-status-light', electrumStatusClass]"></span>
                <span class="wallet-electrum-status-label">{{ electrumStatusLabel }}</span>
                <span class="wallet-electrum-server">{{ electrumServerLabel }}</span>
              </div>
            </div>
            <div class="column is-narrow">
              <router-link
                :to="{ name: 'wallets.settings', params: { walletIdentifier: wallet.identifier, wallet }}"
                class="button is-light is-rounded wallet-settings-button"
              >
                <span class="icon has-text-grey-dark">
                  <b-icon icon="cog" size="is-small"/>
                </span>
              </router-link>
            </div>
            <div class="column">
              <div class="is-pulled-right wallet-header-actions">
                <div class="columns">
                  <div class="column">
                    <div class="buttons">
                      <router-link
                        v-if="supportsSending"
                        :to="{ name: 'wallets.send', params: { walletIdentifier: wallet.identifier, wallet }}"
                        class="button is-primary is-cta wallet-action-button"
                      >
                        <span class="icon">
                          <b-icon icon="credit-card" size="is-small"/>
                        </span>
                        <span v-html="$i18n.t('wallet.send')"/>
                      </router-link>
                      <router-link
                        :to="{ name: 'wallets.receive', params: { walletIdentifier: wallet.identifier, wallet }}"
                        class="button is-primary is-cta wallet-action-button"
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

    <div v-if="showAddressBalances && hasAddressBalances" class="box is-paddingless is-clipped wallet-address-balances">
      <div
        v-for="entry in addressesWithBalance"
        :key="entry.address"
        class="wallet-address-balance-row"
      >
        <code class="wallet-address-balance-address">{{ entry.address }}</code>
        <div class="wallet-address-balance-amount">
          <money :amount="entry.amount" crypto/>
          <span class="wallet-address-balance-path">{{ formatAddressPath(entry.path) }}</span>
        </div>
      </div>
    </div>

    <b-notification
      v-if="!supportsSending"
      type="is-info"
      :closable="false"
    >
      This ElectrumX wallet is in compatibility mode. Receive and balance lookup are available now; send support is coming next.
    </b-notification>

    <div v-if="hasTransactions" class="box is-paddingless is-clipped wallet-transaction-list">
      <transaction-row
        v-for="transaction in transactions"
        :key="transaction.txid"
        :txid="transaction.txid"
        :wallet="wallet"
      />
    </div>
    <div v-else class="box section has-text-centered wallet-empty-state">
      <b-icon icon="list-ul" size="is-large"/>
      <h4 class="title is-4" v-html="$i18n.t('wallet.noTransactions')"/>
      <p class="subtitle" v-html="$i18n.t('wallet.noTransactionsDesc')"/>
    </div>
  </div>
</template>

<script>
import TransactionRow from '@/components/TransactionRow'
import Money from '@/components/labels/Money'
import TxProposalsModal from '@/views/Wallet/TxProposalsModal'

export default {
  name: 'wallet-view',
  components: { TransactionRow, Money },
  data () {
    return {
      showAddressBalances: false
    }
  },
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
    },
    supportsSending () {
      return !this.wallet.info || !this.wallet.info.wallet || this.wallet.info.wallet.supportsSending !== false
    },
    isElectrumxWallet () {
      return this.wallet && this.wallet.info && this.wallet.info.wallet && this.wallet.info.wallet.backend === 'electrumx'
    },
    isVwsWallet () {
      return !this.isElectrumxWallet
    },
    vwsStatus () {
      return this.wallet && this.wallet.connectionStatus
        ? this.wallet.connectionStatus
        : 'connecting'
    },
    vwsStatusClass () {
      return `is-${this.vwsStatus}`
    },
    vwsStatusLabel () {
      switch (this.vwsStatus) {
        case 'connected':
          return 'Connected'
        case 'disconnected':
          return 'Disconnected'
        case 'connecting':
        default:
          return 'Connecting'
      }
    },
    electrumServerLabel () {
      return this.isElectrumxWallet && this.wallet.info.wallet.electrumServer
        ? this.wallet.info.wallet.electrumServer
        : ''
    },
    electrumStatusClass () {
      return this.electrumConnected ? 'is-connected' : 'is-disconnected'
    },
    electrumStatusLabel () {
      return this.electrumConnected ? 'ElectrumX connected' : 'ElectrumX disconnected'
    },
    electrumConnected () {
      return !!(this.isElectrumxWallet && this.wallet.info.wallet.electrumConnected)
    },
    walletCoin () {
      return this.wallet && this.wallet.info && this.wallet.info.wallet && this.wallet.info.wallet.coin
        ? this.wallet.info.wallet.coin
        : 'xvg'
    },
    walletTotalAmount () {
      return this.wallet && this.wallet.info && this.wallet.info.balance
        ? this.wallet.info.balance.totalAmount || 0
        : 0
    },
    addressesWithBalance () {
      return this.wallet && this.wallet.info && this.wallet.info.balance && this.wallet.info.balance.byAddress
        ? this.wallet.info.balance.byAddress.filter(entry => entry.amount > 0)
        : []
    },
    hasAddressBalances () {
      return this.addressesWithBalance.length > 0
    }
  },
  methods: {
    editWallet () {
      this.$buefy.toast.open('Something happened')
    },

    resolveTxProposalIssues () {
      this.$buefy.modal.open({
        component: TxProposalsModal,
        parent: this,
        hasModalCard: true,
        canCancel: ['escape', 'outside'],
        props: {
          wallet: this.wallet
        }
      })
    },

    formatAddressPath (path) {
      return path ? path.replace('m/', 'xpub/') : ''
    }
  }
}
</script>

<style>
.wallet-header-box {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  margin: -1.25rem;
  min-height: 214px;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(83, 243, 255, 0.14);
  box-shadow: 0 20px 44px rgba(1, 4, 18, 0.32), 0 0 28px rgba(83, 243, 255, 0.08);
}

.wallet-header-box-background-blue {
  background: linear-gradient(135deg, #2025ff 0%, #0bc4ff 50%, #9cfcff 100%);
}

.wallet-header-box-background-retrowave {
  background: linear-gradient(135deg, #14052d 0%, #6c18ff 38%, #ff2f92 72%, #ffd166 100%);
}

.wallet-header-box-background-purple {
  background: linear-gradient(135deg, #6c18ff 0%, #ff4fc8 55%, #ffb057 100%);
}

.wallet-header-box-background-green {
  background: linear-gradient(135deg, #00b36c 0%, #26f0a3 55%, #d9ff61 100%);
}

.wallet-header-box-background-orange {
  background: linear-gradient(135deg, #ff6b3d 0%, #ff9a3d 55%, #ffe16d 100%);
}

.wallet-header-box-background-red {
  background: linear-gradient(135deg, #ff2f92 0%, #ff5b9d 55%, #ffbf5f 100%);
}

.wallet-header-background {
  grid-area: 1 / 1;
  mix-blend-mode: screen;
  background-repeat: no-repeat;
  background-position: calc(100% + 36px) center;
  background-size: 220px;
  opacity: 0.24;
}

.wallet-header-grid {
  grid-area: 1 / 1;
  align-self: end;
  height: 50%;
  opacity: 0.14;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px 34px),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px 24px);
  transform: perspective(420px) rotateX(74deg) scaleY(0.82);
  transform-origin: bottom;
  animation: rv-grid-pulse 7.5s ease-in-out infinite;
}

.wallet-header-horizon {
  grid-area: 1 / 1;
  align-self: end;
  justify-self: end;
  width: 164px;
  height: 164px;
  margin: 0 42px 18px 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 237, 183, 0.96) 0, rgba(255, 154, 61, 0.82) 34%, rgba(255, 87, 210, 0.28) 62%, transparent 72%);
  box-shadow: 0 0 44px rgba(255, 154, 61, 0.2);
  opacity: 0.92;
  animation: rv-drift 10s ease-in-out infinite;
}

.wallet-header-background-overlay-gradient {
  background: linear-gradient(90deg, rgba(6, 8, 20, 0.94) 0%, rgba(8, 13, 31, 0.82) 44%, rgba(8, 13, 31, 0.18) 72%, transparent 100%);
  grid-area: 1 / 1;
  z-index: 1;
}

.wallet-header-content {
  grid-area: 1 / 1;
  padding: 1.5rem;
  z-index: 2;
}

.wallet-header-title {
  letter-spacing: 0.12em;
  text-shadow: 0 0 18px rgba(83, 243, 255, 0.14);
}

.wallet-electrum-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.65rem;
  flex-wrap: wrap;
  color: var(--rv-text-soft);
  font-size: 0.92rem;
}

.wallet-electrum-status-light {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
}

.wallet-electrum-status-light.is-connected {
  background: #24dc8f;
  color: #24dc8f;
}

.wallet-electrum-status-light.is-disconnected {
  background: #ff5ba4;
  color: #ff5ba4;
}

.wallet-electrum-status-label {
  font-weight: 600;
  color: var(--rv-text);
}

.wallet-electrum-server {
  color: var(--rv-text-soft);
  opacity: 0.92;
}

.wallet-vws-status {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.65rem;
  flex-wrap: wrap;
  font-size: 0.92rem;
}

.wallet-vws-status-label {
  color: var(--rv-text-soft);
  font-weight: 600;
}

.wallet-vws-status-value {
  font-weight: 700;
}

.wallet-vws-status-value.is-connected {
  color: #24dc8f;
  text-shadow: 0 0 12px rgba(36, 220, 143, 0.2);
}

.wallet-vws-status-value.is-disconnected {
  color: #ff5ba4;
  text-shadow: 0 0 12px rgba(255, 91, 164, 0.2);
}

.wallet-vws-status-value.is-connecting {
  color: #fff;
  background: linear-gradient(90deg, #53f3ff 0%, #ff2f92 42%, #ffd166 72%, #53f3ff 100%);
  background-size: 240% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: wallet-vws-status-gradient 1.6s linear infinite;
}

.wallet-address-balance-toggle {
  display: inline-flex;
  margin-top: 0.65rem;
  color: var(--rv-text-soft);
}

.wallet-address-balances {
  border-color: rgba(83, 243, 255, 0.16);
}

.wallet-address-balance-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(83, 243, 255, 0.12);
}

.wallet-address-balance-row:last-child {
  border-bottom: none;
}

.wallet-address-balance-address {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(83, 243, 255, 0.08);
  color: var(--rv-text);
}

.wallet-address-balance-amount {
  margin-left: auto;
  text-align: right;
  white-space: nowrap;
}

.wallet-address-balance-path {
  display: block;
  color: var(--rv-text-muted);
  font-size: 0.78rem;
}

.wallet-settings-button {
  min-width: 46px;
}

.wallet-action-button {
  min-width: 11.75rem;
}

.wallet-header-actions {
  display: inline-block;
}

.wallet-header-actions .buttons {
  justify-content: flex-end;
}

.wallet-transaction-list {
  border-color: rgba(83, 243, 255, 0.16);
}

.wallet-empty-state {
  background: linear-gradient(180deg, rgba(16, 23, 53, 0.82), rgba(10, 16, 38, 0.74));
}

@media (max-width: 768px) {
  .wallet-header-box {
    min-height: 240px;
  }

  .wallet-header-horizon {
    width: 120px;
    height: 120px;
    margin-right: 24px;
  }

  .wallet-header-content {
    padding: 1.1rem;
  }

  .wallet-header-actions {
    float: none !important;
    margin-top: 1rem;
  }

  .wallet-header-actions .buttons {
    justify-content: flex-start;
  }

  .wallet-address-balance-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .wallet-address-balance-amount {
    margin-left: 0;
    text-align: left;
  }
}

@keyframes wallet-vws-status-gradient {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 240% 50%;
  }
}
</style>
