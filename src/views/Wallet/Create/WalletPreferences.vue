<template>
  <div>
    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.aWalletName')"/>
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
            size="is-large"
            :placeholder="$i18n.t('createWallet.enterYourWalletName')"
            v-model="wallet.name"
          />
        </b-field>

        <b-field :label="$i18n.t('createWallet.walletColor')">
          <b-select size="is-large" v-model="wallet.color" expanded>
            <option value="blue" selected>Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
          </b-select>
        </b-field>

        <b-field>
          <b-switch v-model="showAdvanced"><span v-html="$i18n.t('createWallet.advanced')"/></b-switch>
        </b-field>

        <div class="box" v-show="showAdvanced">
          <b-field :label="$i18n.t('createWallet.singleAddress')">
            <b-switch
              v-model="wallet.singleAddress"
            />
          </b-field>

          <b-field :label="$i18n.t('createWallet.serviceURL')">
            <b-input
              v-model="wallet.vwsApi"
            />
          </b-field>
        </div>

      </div>
    </div>

    <b-field align="right">
      <b-button
        icon-left="edit"
        :label="$i18n.t('createWallet.writeDownPaperKey')"
        type="is-primary"
        @click="$emit('next')"
        :disabled="!preferencesAreValid"
      />
    </b-field>
  </div>
</template>

<script>
import WalletCard from '@/components/WalletCard'
import { mapGetters } from 'vuex'

export default {
  name: 'WalletPreferences',
  components: { WalletCard },
  data () {
    return {
      showAdvanced: false
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },
  computed: {
    nameLongEnough () {
      return this.wallet.name.length < 1 || this.wallet.name.length > 4
    },
    nameExists () {
      return this.allWalletNames().includes(this.wallet.name)
    },
    preferencesAreValid () {
      return this.wallet.name !== '' && this.nameLongEnough && !this.nameExists
    }
  },
  methods: {
    ...mapGetters(['allWalletNames'])
  }
}
</script>

<style scoped>
.card-column {
  max-width: 250px;
}
</style>
