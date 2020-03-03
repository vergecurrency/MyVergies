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
            <option value="red" selected>Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
            <!--<option value="yellow">Yellow</option>-->
          </b-select>
        </b-field>

      </div>
    </div>

    <b-field align="right">
      <b-button
        icon-left="edit"
        :label="$i18n.t('createWallet.writeDownPaperKey')"
        type="is-primary"
        @click="$emit('next')"
      />
    </b-field>
  </div>
</template>

<script>
import WalletCard from '@/components/WalletCard'

export default {
  name: 'WalletPreferences',
  components: { WalletCard },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card-column {
  max-width: 250px;
}
</style>
