<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" title="Receive"/>

    <div class="box">

      <div class="notification">
        <div class="content is-small">
          <p class="has-text-weight-semibold">
            Receiving XVG is easy! Just use the following address to receive funds on.
          </p>
          <p class="is-small">
            When you've used this address once this wallet will generate a new address for you.
            However the previous address can still be used to receive funds on.
          </p>
        </div>
      </div>

      <div class="hero">
        <div class="hero-body">
          <div class="columns is-vcentered">
            <div class="column is-narrow">
              <div class="qr-box has-shadow-dark">
                <qrcode-vue :value="address" size="200" level="H"/>
              </div>
            </div>
            <div class="column">
              <p>Your receive address</p>
              <p v-html="address" class="has-text-weight-bold"/>
              <hr/>
              <div class="buttons">
                <a class="button">
                  New address
                </a>
                <a class="button">
                  Copy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'receive-view',
  components: { NavigationHeader, QrcodeVue },
  data () {
    return {
      address: 'DF7R7M5semP472WSvK6WPZkDM1h9ixTL6F'
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
  .qr-box {
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: 10px;
  }
</style>
