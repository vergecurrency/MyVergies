<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletIdentifier: wallet.identifier, wallet }}" :title="$i18n.t('receive.receive')"/>

    <div class="box is-paddingless">
      <b-tabs v-model="activeTab" :animated="false">
        <b-tab-item :label="$i18n.t('receive.newAddress')">
          <div class="px-1 py-1">
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
          </div>
        </b-tab-item>

        <b-tab-item :label="$i18n.t('receive.addresses')">
          <div class="px-1 py-1">
            <form-section :title="$i18n.t('receive.addresses')" no-divider>
              <form-box
                :title="$i18n.t('receive.scanAddressesForBalance')"
                :description="$i18n.t('receive.scanAddressesForBalanceDesc')"
                type="is-info"
              >
                <b-button
                  type="is-info"
                  :label="$i18n.t('receive.scanAddressesForBalance')"
                  @click="scan"
                />
              </form-box>
            </form-section>

            <form-section :title="$i18n.t('receive.addressesWithBalance')">
              <div class="box is-paddingless is-clipped">

                <b-table v-if="addressesWithBalance.length > 0" :data="addressesWithBalance" narrowed>
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

                <div v-else class="p-5">
                  <span v-html="$i18n.t('receive.noAddressesWithBalance')" />
                </div>

              </div>
            </form-section>

            <form-section :title="$i18n.t('receive.unusedAddresses')">
              <div class="box is-paddingless is-clipped">

                <b-table v-if="unusedAddresses.length > 0" :data="unusedAddresses" narrowed>
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

                <div v-else class="p-5">
                  <span v-html="$i18n.t('receive.noUnusedAddresses')" />
                </div>

              </div>
            </form-section>

          </div>
        </b-tab-item>
      </b-tabs>

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
    scan () {
      this.wallet.scan().then(scanStarted => {
        this.$buefy.dialog.alert({
          message: this.$i18n.t('receive.addressScanRequested'),
          icon: 'info',
          hasIcon: true
        })

        Log.info('wallet address scan requested')
      }).catch(e => {
        this.$buefy.dialog.alert({
          message: e.message
        })

        Log.error('wallet address scan failed', e)
      })
    },

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
