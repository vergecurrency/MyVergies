<template>
  <div :class="containerClass">
    <div class="wallet-menu-card-background"></div>
    <div class="wallet-menu-card-content">
      <p class="is-uppercase is-size-7 has-text-weight-semibold" v-html="wallet.name"/>
      <p class="is-size-5 has-text-weight-bold" v-html="cryptoAmount"/>
      <p class="is-size-7" v-html="convertedPrice"/>
    </div>
  </div>
</template>

<script>
  import { remote } from 'electron'
  import { getFormattedCurrency, getFromattedCrypto } from '../utils/money'
  import { mapGetters } from 'vuex'

  export default {
    name: 'WalletMenuCard',
    props: {
      wallet: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters(['currentRate']),
      containerClass () {
        return 'wallet-menu-card wallet-menu-card-background-' + this.wallet.color
      },
      cryptoAmount () {
        return getFromattedCrypto(this.wallet.amount, remote.app.getLocale(), 'XVG')
      },
      convertedPrice () {
        const amount = this.wallet.amount * this.currentRate
        return getFormattedCurrency(amount, remote.app.getLocale())
      }
    }
  }
</script>

<style lang="scss">
  .wallet-menu-card {
    position: relative;
    background: white;
    border-radius: 10px;
    color: white;
    height: 120px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.5s ease-in-out;
    cursor: pointer;
  }

  .wallet-menu-card-background {
    background: url('~@/assets/wallet-background-logo.svg') no-repeat right;
    mix-blend-mode: overlay;
    height: 100%;
    opacity: 0.75;
  }

  .wallet-menu-card-background-blue {
    background: rgb(27,154,220);
    background: linear-gradient(145deg, rgb(0, 30, 220) 0%, rgb(14, 149, 202) 20%, rgb(117, 240, 236) 70%);
    box-shadow: 0 4px 20px rgba(14, 149, 202, 0.5);
  }

  .wallet-menu-card-background-blue:hover {
    box-shadow: 0 4px 40px rgb(11, 140, 202);
  }

  .wallet-menu-card-background-purple {
    background: rgb(90,0,188);
    background: linear-gradient(145deg, rgb(90, 0, 188) 0%, rgb(228, 62, 120) 100%);
    box-shadow: 0 4px 20px rgba(228, 62, 120, 0.5);
  }

  .wallet-menu-card-background-purple:hover {
    box-shadow: 0 4px 40px rgb(209, 57, 228);
  }

  .wallet-menu-card-background-green {
    background: rgb(27,138,117);
    background: linear-gradient(145deg, rgb(0, 155, 94) 0%, rgb(217, 255, 51) 100%);
    box-shadow: 0 4px 20px rgba(44, 214, 2, 0.5);
  }

  .wallet-menu-card-background-green:hover {
    box-shadow: 0 4px 40px rgb(1, 214, 133);
  }

  .wallet-menu-card-background-orange {
    background: rgb(188,76,0);
    background: linear-gradient(145deg, rgb(188, 76, 0) 0%, rgb(254, 255, 29) 100%);
    box-shadow: 0 4px 20px rgba(255, 133, 29, 0.5);
  }

  .wallet-menu-card-background-orange:hover {
    box-shadow: 0 4px 40px rgb(255, 154, 120);
  }

  .wallet-menu-card-background-red {
    background: rgb(188,0,89);
    background: linear-gradient(145deg, rgb(188, 0, 89) 0%, rgb(228, 181, 62) 100%);
    box-shadow: 0 4px 20px rgba(228, 181, 62, 0.5);
  }

  .wallet-menu-card-background-red:hover {
    box-shadow: 0 4px 40px rgb(228, 76, 53);
  }

  .wallet-menu-card-content {
    height: 100%;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding: 15px;
  }
</style>
