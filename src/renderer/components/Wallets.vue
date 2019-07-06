<template>
  <div :class="walletColor">
    <div class="wallet-background-logo"></div>
    <div class="wallet-content">
      <b-tabs
        v-if="tabsTurnedOn"
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
          <Wallet wallet="wallet"/>

        </b-tab-item>

        <b-tab-item label="Add wallet">
          <AddWallet @wallet="walletAdded"/>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
  import BTabItem from 'buefy/src/components/tabs/TabItem'
  import AddWallet from './AddWallet'
  import Wallet from './Wallet'

  export default {
    name: 'wallets',
    components: {Wallet, AddWallet, BTabItem},

    mounted () {
      this.selectedWallet = this.wallets[0]
    },

    data () {
      return {
        tabsTurnedOn: true,
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
      },

      walletAdded (wallet) {
        this.tabsTurnedOn = false
        this.wallets.push(wallet)

        this.$nextTick(() => {
          this.tabsTurnedOn = true
          this.walletSelected(this.wallets.length - 1)
        })
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

</style>
