<template>
  <div>
    <form @submit.prevent="proceed">
      <div class="block">
        <h3 class="is-size-3 is-family-display wallet-preferences-title" v-html="$i18n.t('createWallet.aWalletName')"/>
        <p v-html="$i18n.t('createWallet.aWalletNameDescription')"/>
      </div>

      <div class="columns">
        <div class="column card-column">

          <b-field label="Card example">
            <wallet-card :wallet="wallet"/>
          </b-field>

        </div>
        <div class="column">

          <b-field :label="$i18n.t('createWallet.walletName')">
            <b-input
              :placeholder="$i18n.t('createWallet.enterYourWalletName')"
              v-model="name"
              maxlength="15"
            />
          </b-field>

          <b-field :label="$i18n.t('createWallet.walletColor')">
            <b-select v-model="color" expanded>
              <option value="retrowave" selected v-html="$i18n.t('main.colors.retrowave')"/>
              <option value="blue" v-html="$i18n.t('main.colors.blue')"/>
              <option value="red" v-html="$i18n.t('main.colors.red')"/>
              <option value="green" v-html="$i18n.t('main.colors.green')"/>
              <option value="purple" v-html="$i18n.t('main.colors.purple')"/>
              <option value="orange" v-html="$i18n.t('main.colors.orange')"/>
            </b-select>
          </b-field>

          <b-field v-if="restore" label="Restore mode">
            <b-select v-model="backend" expanded>
              <option value="electrumx">Verge XVR/Android+Meta-compatible 18-word seedphrase</option>
              <option value="vws">Legacy MyVergies/iOS 12-words seedphrase + passphrase</option>
            </b-select>
          </b-field>

          <b-field>
            <b-switch v-model="showAdvanced"><span v-html="$i18n.t('createWallet.advanced')"/></b-switch>
          </b-field>

          <div class="box wallet-preferences__advanced__box" v-show="showAdvanced">
            <b-field v-if="!restore" :label="$i18n.t('createWallet.singleAddress')">
              <b-switch
                v-model="singleAddress"
              />
            </b-field>

            <b-field v-if="backend !== 'electrumx'" :label="$i18n.t('createWallet.serviceURL')" :type="vwsApiValid ? '' : 'is-danger'">
              <b-input
                ref="vwsApi"
                type="url"
                :use-html5-validation="true"
                v-model="vwsApi"
              />
            </b-field>

            <b-field v-else label="ElectrumX server">
              <b-input :value="electrumServer" expanded disabled />
            </b-field>
          </div>

        </div>
      </div>

      <b-field align="right">
        <b-button
          native-type="submit"
          icon-left="edit"
          :label="restore ? 'Continue to recovery phrase' : 'Next: Create Seedphrase + Wallet'"
          type="is-primary"
          :disabled="!preferencesAreValid"
        />
      </b-field>
    </form>
  </div>
</template>

<script>
import WalletCard from '@/components/WalletCard'
import { mapGetters } from 'vuex'
import { isValidVwsApiUrl, resolveVwsApiUrl } from '@/utils/vwsApi'
import { serializeElectrumServer } from '@/utils/electrumServers'

export default {
  name: 'WalletPreferences',
  components: { WalletCard },
  data () {
    return {
      showAdvanced: false,
      name: '',
      color: 'retrowave',
      backend: 'vws',
      singleAddress: false,
      vwsApi: '',
      electrumServer: ''
    }
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    restore: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['allWalletIdentifiers', 'currentElectrumServer']),
    wallet () {
      return {
        ...this.value,
        name: this.name,
        color: this.color,
        backend: this.backend,
        singleAddress: this.singleAddress,
        vwsApi: this.vwsApi,
        electrumServer: this.electrumServer
      }
    },
    nameLongEnough () {
      return this.wallet.name.length < 1 || this.wallet.name.length > 4
    },
    nameNotTooLong () {
      return this.wallet.name.length <= 15
    },
    nameExists () {
      return this.$walletManager.getWallets().map(wallet => wallet.name).includes(this.wallet.name)
    },
    vwsApiValid () {
      return this.backend === 'electrumx' || isValidVwsApiUrl(this.vwsApi)
    },
    preferencesAreValid () {
      return this.wallet.name !== '' && this.nameLongEnough && this.nameNotTooLong && !this.nameExists && this.vwsApiValid
    }
  },
  created () {
    this.name = this.value.name
    this.color = this.value.color
    this.backend = this.value.backend || 'vws'
    this.singleAddress = this.value.singleAddress
    this.vwsApi = resolveVwsApiUrl(this.value.vwsApi)
    this.electrumServer = this.value.electrumServer || serializeElectrumServer(this.currentElectrumServer)
  },
  methods: {
    proceed () {
      if (!this.preferencesAreValid) {
        return
      }

      if (this.backend !== 'electrumx') {
        this.vwsApi = resolveVwsApiUrl(this.vwsApi)
      }
      this.$emit('input', this.wallet)
      this.$emit('next')
    }
  }
}
</script>

<style scoped>
.wallet-preferences-title {
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rv-text);
  text-shadow:
    0 0 10px rgba(124, 255, 242, 0.18),
    0 0 24px rgba(50, 239, 222, 0.24);
}

.card-column {
  max-width: 250px;
}
.wallet-preferences__advanced__box {
  margin: 0 -20px;
}
</style>
