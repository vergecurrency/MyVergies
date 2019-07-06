<template>
  <div :class="walletColor">
    <div class="wallet-background-logo"></div>
    <div class="wallet-content">
      <b-tabs
        v-model="activeTab"
        class="wallet-tabs"
        :animated="false"
        @input="walletSelected"
      >
        <b-tab-item
          v-for="wallet in wallets"
          :key="wallet.name"
          :label="wallet.name"
        >
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
                    <a class="button">Send</a>
                    <a class="button">Receive</a>
                    <a class="button">
                      <img src="~@/assets/icons/settings.svg" width="20" height="20"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box is-shadowless is-paddingless wallet-details">
            <Transactions/>
          </div>
        </b-tab-item>
        <b-tab-item label="Add wallet">
          <AddWallet/>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
  import BTabItem from 'buefy/src/components/tabs/TabItem'
  import Transactions from './Transactions'
  import AddWallet from './AddWallet'

  export default {
    name: 'wallets',
    components: {AddWallet, Transactions, BTabItem},

    mounted () {
      this.selectedWallet = this.wallets[0]
    },

    data () {
      return {
        wallets: [
          {
            name: 'Main Account',
            color: 'blue'
          },
          {
            name: 'Savings Account',
            color: 'purple'
          },
          {
            name: 'Business Account',
            color: 'green'
          }
        ],
        activeTab: 0,
        selectedWallet: null
      }
    },

    computed: {
      walletColor () {
        return this.selectedWallet
          ? 'wallet-background wallet-background-' + this.selectedWallet.color
          : 'wallet-background'
      }
    },

    methods: {
      walletSelected (walletIndex) {
        this.selectedWallet = this.wallets[walletIndex]
      }
    }
  }
</script>

<style>
  .wallet-background {
    background: white;
    height: 100%;
    position: relative;
  }

  .wallet-background-blue {
    background: rgb(27,154,220);
    background: linear-gradient(145deg, rgb(0, 30, 220) 0%, rgb(14, 149, 202) 20%, rgb(117, 240, 236) 70%);
  }

  .wallet-background-purple {
    background: rgb(90,0,188);
    background: linear-gradient(145deg, rgba(90,0,188,1) 0%, rgba(228,62,120,1) 100%);
  }

  .wallet-background-green {
    background: rgb(27,138,117);
    background: linear-gradient(145deg, rgb(0, 155, 94) 0%, rgba(217,255,51,1) 100%);
  }

  .wallet-background-orange {
    background: rgb(188,76,0);
    background: linear-gradient(145deg, rgba(188,76,0,1) 0%, rgba(254,255,29,1) 100%);
  }

  .wallet-background-red {
    background: rgb(188,0,89);
    background: linear-gradient(145deg, rgba(188,0,89,1) 0%, rgba(228,181,62,1) 100%);
  }

  .wallet-background-logo {
    background: url('~@/assets/wallet-background-logo.svg') no-repeat right;
    mix-blend-mode: overlay;
    height: 100%;
    opacity: 0.75;
  }

  .wallet-content {
    height: 100%;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }

  .wallet-summary-container {
    padding: 1em;
  }

  .wallet-tabs {
    height: 100%;
  }

  .wallet-tabs > section.tab-content {
    height: calc(100% - 39px);
  }

  .wallet-tabs .tab-item {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .wallet-tabs > .tabs ul,
  .wallet-tabs > .tabs a,
  .wallet-tabs > .tabs li.is-active a {
    border-bottom: none;
  }

  .wallet-tabs > .tabs a {
    justify-content: left;
  }

  .wallet-tabs > .tabs li.is-active:not(:last-child) a {
    color: white;
  }

  .wallet-tabs > .tabs li:last-child {
    width: -webkit-fill-available;
  }

  .wallet-tabs > .tabs li {
    background-color: white;
  }

  .wallet-tabs > .tabs li.is-active {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .wallet-details {
    height: 100%;
    overflow: scroll;
    flex-grow: 1;
    margin-left: -1em;
    margin-right: -1em;
    margin-bottom: -1em;
    border-bottom-right-radius: 0!important;
  }

  .balance-description-label {
    font-size: 0.6rem;
    line-height: 0.6rem;
  }

  .balance-label {
    line-height: 80%;
  }
</style>
