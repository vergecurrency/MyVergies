<template>
  <div>
    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.aWalletName')"/>
      <p v-html="$i18n.t('createWallet.aWalletNameDescription')"/>
    </div>

    <p>Hello</p>

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
  name: 'Created'
}
</script>
