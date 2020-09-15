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
        <div class="box is-paddingless is-clipped">
          <div class="pt-4 pb-4 pl-4">
            <h6 class="is-6 title" v-html="$i18n.t('receive.unusedAddresses')"/>
          </div>

          <b-table :data="unusedAddresses" narrowed>
            <b-table-column field="address" label="Address" v-slot="{ row }" header-class="is-narrow">
              <code>{{ row.address }}</code>
            </b-table-column>

            <b-table-column field="path" label="Path" sortable v-slot="{ row }">
              {{ row.path.replace('m/', 'xpub/') }}
            </b-table-column>

            <b-table-column
              field="createdOn"
              label="Created on"
              sortable
              v-slot="{ row }"
              cell-class="has-text-right"
              header-class="has-text-right"
            >
              {{ row.createdOn }}
            </b-table-column>

            <b-table-column header-class="is-narrow" v-slot="{ row }">
              <b-button size="is-small" icon-left="ellipsis-v" @click="copyAddress(row)"/>
            </b-table-column>
          </b-table>

          <div class="pt-4 pb-4 pl-4">
            <h6 class="is-6 title" v-html="$i18n.t('receive.addressesWithBalance')"/>
          </div>

          <b-table :data="addressesWithBalance" narrowed>
            <b-table-column field="address" label="Address" v-slot="{ row }" header-class="is-narrow">
              <code>{{ row.address }}</code>
            </b-table-column>

            <b-table-column field="path" label="Path" sortable v-slot="{ row }">
              {{ row.path.replace('m/', 'xpub/') }}
            </b-table-column>

            <b-table-column field="amount" label="Amount" sortable v-slot="{ row }">
              {{ formatAmountFromSatoshis(row.amount, $electron.remote.app.getLocale()) }}
            </b-table-column>

            <b-table-column header-class="is-narrow" v-slot="{ row }">
              <b-button size="is-small" icon-left="ellipsis-v" @click="copyAddress(row)"/>
            </b-table-column>
          </b-table>

        </div>
      </form-section>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import AddressCopyModal from '@/views/Wallet/Receive/AddressCopyModal'
import FormSection from '@/components/layout/FormSection'
import FormBox from '@/components/layout/FormBox'
import QrcodeVue from 'qrcode.vue'
import Log from 'electron-log'
import moment from 'moment'

export default {
  name: 'receive-view',

  components: { FormBox, FormSection, NavigationHeader, QrcodeVue },

  data () {
    return {
      activeTab: 0,
      address: null,
      isAddressOptionsModalActive: false
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
        address.createdOn = moment(address.createdOn * 1000).locale(this.$electron.remote.app.getLocale()).format('lll')

        return address
      })
    },

    addressesWithBalance () {
      return this.wallet.info.balance.byAddress
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
    },

    async copyAddress (row) {
      if (!this.isAuthenticated && !await this.$authManager.showAuthenticationModal()) {
        return
      }

      const address = row
      const bip44PrivateKey = (await this.$walletManager.getDerivedXPrivKey(this.wallet)).derive(address.path)
      address.publicKey = bip44PrivateKey.publicKey.toString()
      address.privateKey = bip44PrivateKey.privateKey.toWIF()

      this.$buefy.modal.open({
        component: AddressCopyModal,
        parent: this,
        hasModalCard: true,
        canCancel: ['escape', 'outside'],
        props: {
          address
        }
      })
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
