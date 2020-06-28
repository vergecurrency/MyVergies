<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" :title="$i18n.t('receive.receive')"/>

    <div class="box">

        <b-tabs v-model="activeTab">
          <b-tab-item :label="$i18n.t('receive.newAddress')" icon="star">

            <section class="section">
              <div v-if="address" class="columns is-vcentered">
                <div class="column is-narrow">
                  <div class="qr-box has-shadow-dark">
                    <qrcode-vue :value="address" size="200" level="H"/>
                  </div>
                </div>
                <div class="column">
                  <b-field :label="$i18n.t('receive.yourReceiveAddress')">
                    <b-notification :closable="false">
                      <span class="has-text-weght-bold">{{ address }}</span>
                    </b-notification>
                  </b-field>
                  <div class="buttons">
                    <a class="button is-primary" @click="getNewAddress" v-html="$i18n.t('receive.newAddress')"/>
                    <a class="button is-primary" @click="copy" v-html="$i18n.t('receive.copy')"/>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="columns is-vcentered">
                  <div class="column is-narrow">
                    <b-skeleton animated height="200" width="200"></b-skeleton>
                  </div>
                  <div class="column">
                    <b-skeleton width="20%" animated></b-skeleton>
                    <b-skeleton width="40%" animated></b-skeleton>
                    <b-skeleton width="80%" animated></b-skeleton>
                    <b-skeleton animated></b-skeleton>
                  </div>
                </div>
              </div>
            </section>

          </b-tab-item>
          <b-tab-item :label="$i18n.t('receive.previousAddresses')" icon="list">
            <b-table :data="wallet.addresses" :columns="addressColumns"/>
          </b-tab-item>
        </b-tabs>

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
      activeTab: 0,
      address: null,
      addressColumns: [
        {
          field: 'address',
          label: 'Address'
        },
        {
          field: 'path',
          label: 'Path'
        },
        {
          field: 'createdOn',
          label: 'Created On'
        }
      ]
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  created () {
    this.getAddress()
  },

  methods: {
    getAddress () {
      this.wallet.getAddress().then(addressInfo => {
        this.address = addressInfo.address
      }).catch(e => {
        this.$buefy.dialog.alert({
          message: e.message
        })
      })
    },

    getNewAddress () {
      this.wallet.createAddress().then(addressInfo => {
        this.address = addressInfo.address
      }).catch(e => {
        this.$buefy.dialog.alert({
          message: e.message
        })
      })
    },

    copy () {
      this.$electron.clipboard.writeText(this.address, 'selection')

      this.$buefy.toast.open({
        message: this.$i18n.t('receive.addressCopied'),
        type: 'is-success'
      })
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
