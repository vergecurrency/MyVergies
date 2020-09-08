<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" :title="$i18n.t('receive.receive')"/>

    <div class="box">

      <form-section :title="$i18n.t('receive.newAddress')" no-divider>
        <form-box
          :title="$i18n.t('receive.yourReceiveAddress')"
          :description="$i18n.t('receive.qrCodeDesc')"
          :is-narrow="false"
          grouped
        >
          <b-field v-if="address">
            <b-notification :closable="false">
              <span class="has-text-weght-bold">{{ address }}</span>
            </b-notification>
          </b-field>
          <div v-else style="margin-bottom: 12px">
            <b-skeleton animated height="64"></b-skeleton>
          </div>
          <div class="buttons" :style="{ justifyContent: 'flex-end' }">
            <a class="button is-primary" @click="getNewAddress" v-html="$i18n.t('receive.newAddress')"/>
            <a class="button is-primary" @click="copy" v-html="$i18n.t('receive.copy')"/>
          </div>
        </form-box>

        <form-box
          :title="$i18n.t('receive.qrCode')"
          :description="$i18n.t('receive.qrCodeDesc')"
          grouped
        >
          <div v-if="address" class="qr-box has-shadow-dark">
            <qrcode-vue :value="address" size="150" level="H"/>
          </div>
          <div v-else>
            <b-skeleton animated height="150" width="150"></b-skeleton>
          </div>
        </form-box>
      </form-section>

      <form-section :title="$i18n.t('receive.addresses')">
        <div class="box has-background-warning-light">
          <h6 class="is-6 title" v-html="$i18n.t('receive.unusedAddresses')"/>
          <div class="box is-paddingless is-clipped">
            <b-table :data="unusedAddresses">
              <b-table-column field="address" label="Address" v-slot="{ row }">
                {{ row.address }}
              </b-table-column>

              <b-table-column field="path" label="Path" sortable v-slot="{ row }">
                {{ row.path }}
              </b-table-column>

              <b-table-column field="createdOn" label="Created on" sortable v-slot="{ row }">
                {{ row.createdOn }}
              </b-table-column>
            </b-table>
          </div>

          <h6 class="is-6 title" v-html="$i18n.t('receive.addressesWithBalance')"/>
          <div class="box is-paddingless is-clipped">
            <b-table :data="addressesWithBalance">
              <b-table-column field="address" label="Address" v-slot="{ row }">
                {{ row.address }}
              </b-table-column>

              <b-table-column field="path" label="Path" sortable v-slot="{ row }">
                {{ row.path }}
              </b-table-column>

              <b-table-column field="amount" label="Amount" sortable v-slot="{ row }">
                {{ row.amount }}
              </b-table-column>
            </b-table>
          </div>
        </div>
      </form-section>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import QrcodeVue from 'qrcode.vue'
import Log from 'electron-log'
import FormSection from '@/components/layout/FormSection'
import FormBox from '@/components/layout/FormBox'
import moment from 'moment'

export default {
  name: 'receive-view',

  components: { FormBox, FormSection, NavigationHeader, QrcodeVue },

  data () {
    return {
      activeTab: 0,
      address: null
    }
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  computed: {
    unusedAddresses () {
      return this.wallet.addresses.map(address => {
        return {
          address: address.address,
          path: address.path.replace('m/', 'xpub/'),
          createdOn: moment(address.createdOn * 1000).locale(this.$electron.remote.app.getLocale()).format('lll')
        }
      })
    },

    addressesWithBalance () {
      return this.wallet.info.balance.byAddress.map(address => {
        return {
          address: address.address,
          path: address.path.replace('m/', 'xpub/'),
          amount: this.formatAmountFromSatoshis(address.amount, this.$electron.remote.app.getLocale())
        }
      })
    }
  },

  created () {
    this.getAddress()
  },

  methods: {
    getAddress () {
      this.wallet.getAddress().then(addressInfo => {
        this.address = addressInfo.address

        Log.info('got a wallet address')
      }).catch(e => {
        this.$buefy.dialog.alert({
          message: e.message
        })

        Log.error('error while getting a wallet address', e)
      })
    },

    getNewAddress () {
      this.wallet.createAddress().then(addressInfo => {
        this.address = addressInfo.address

        Log.info('got a new wallet address')
      }).catch(e => {
        this.$buefy.dialog.alert({
          message: e.message
        })

        Log.error('error while getting a new wallet address', e)
      })
    },

    copy () {
      this.$electron.clipboard.writeText(this.address, 'selection')

      this.$buefy.toast.open({
        message: this.$i18n.t('receive.addressCopied'),
        type: 'is-success'
      })

      Log.info('copied wallet address')
    }
  }
}
</script>

<style scoped>
  .qr-box {
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 5px;
  }
</style>
