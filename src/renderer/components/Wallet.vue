<template>
  <div style="height: 100%;">
    <div class="columns wallet-summary-container">
      <div class="column">
        <div class="container has-text-light">
          <div class="columns is-vcentered">
            <div class="column has-text-weight-semibold">
              <p class="is-size-3 balance-label">1.223.434,44 XVG</p>
              <small class="balance-description-label">XVG BALANCE</small>
            </div>
            <div class="column has-text-weight-semibold">
              <p class="is-size-5 balance-label">43.544,65 XVG</p>
              <small class="balance-description-label">EURO BALANCE</small>
            </div>
            <div class="column is-narrow">
              <a class="button" @click="send(wallet)">Send</a>
              <a class="button" @click="receive(wallet)">Receive</a>
              <a class="button" @click="settings(wallet)">
                <img src="~@/assets/icons/settings.svg" width="20" height="20"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box is-shadowless is-paddingless wallet-details">
      <TransactionRow
        v-for="transaction in transactions"
        :key="transaction.txid"
        transaction="transaction"
        @click="openTransaction(transaction)"
      />
    </div>
  </div>
</template>
<script>
  import TransactionRow from './TransactionRow'
  import TransactionDetailsModal from './modals/TransactionDetailsModal'
  import SendModal from './modals/SendModal'
  import ReceiveModal from './modals/ReceiveModal'
  import WalletSettingsModal from './modals/WalletSettingsModal'

  export default {
    name: 'Wallet',
    components: {TransactionRow},
    data () {
      return {
        transactions: [
          {
            txid: 123455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435545465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          }
        ]
      }
    },
    methods: {
      openTransaction (transaction) {
        this.$modal.open({
          parent: this,
          component: TransactionDetailsModal,
          hasModalCard: true,
          canCancel: ['escape']
        })
      },

      send (wallet) {
        this.$modal.open({
          parent: this,
          component: SendModal,
          hasModalCard: true,
          canCancel: ['escape']
        })
      },

      receive (wallet) {
        this.$modal.open({
          parent: this,
          component: ReceiveModal,
          hasModalCard: true,
          canCancel: ['escape']
        })
      },

      settings (wallet) {
        this.$modal.open({
          parent: this,
          component: WalletSettingsModal,
          hasModalCard: true,
          canCancel: ['escape']
        })
      }
    }
  }
</script>
<style>

  .wallet-summary-container {
    padding: 1em;
  }

  .wallet-details {
    height: 100%;
    overflow: scroll;
    flex-grow: 1;
    margin-left: -1em;
    margin-right: -1em;
    margin-bottom: -1em;
    border-bottom-right-radius: 0 !important;
  }

  .balance-description-label {
    font-size: 0.6rem;
    line-height: 0.6rem;
  }

  .balance-label {
    line-height: 80%;
  }
</style>
