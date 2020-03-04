<template>
  <div>
    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.aWalletName')"/>
      <p v-html="$i18n.t('createWallet.aWalletNameDescription')"/>
    </div>

    <b-field :label="$i18n.t('createWallet.passPhrase')">
      <b-input
        size="is-large"
        type="password"
        :placeholder="$i18n.t('createWallet.enterYourWalletName')"
        password-reveal
      />
    </b-field>

    <b-field align="right">
      <b-button
        icon-left="edit"
        :label="$i18n.t('createWallet.passPhrase')"
        type="is-primary"
        @click="$emit('next')"
      />
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'PassPhrase'
}
</script>

<style scoped>

</style>
