<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" title="Receive"/>

    <div class="box">

      <info-notification>
        <template slot="title">
          Receiving XVG is easy!
        </template>
        <template slot="subtitle">
          Just use the following address to receive funds on.
        </template>
        <template slot="content">
          When you've used this address once this wallet will generate a new address for you.<br/>
          However the previous address can still be used to receive funds on.
        </template>
      </info-notification>

        <b-tabs v-model="activeTab">
          <b-tab-item label="New Address" icon="star">

            <section class="section">
              <div class="columns is-vcentered">
                <div class="column is-narrow">
                  <div class="qr-box has-shadow-dark">
                    <qrcode-vue :value="address" size="200" level="H"/>
                  </div>
                </div>
                <div class="column">
                  <p>Your receive address</p>
                  <p class="has-text-weight-bold">{{address}}</p>
                  <hr/>
                  <div class="buttons">
                    <a class="button is-primary">
                      New address
                    </a>
                    <a class="button is-primary">
                      Copy
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </b-tab-item>
          <b-tab-item label="Previous Addresses" icon="list">
            <section class="section">
              Lorem ipsum dolor sit amet.
            </section>
          </b-tab-item>
        </b-tabs>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import InfoNotification from '@/components/InfoNotification'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'receive-view',
  components: { InfoNotification, NavigationHeader, QrcodeVue },
  data () {
    return {
      activeTab: 0,
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
