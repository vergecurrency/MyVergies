<template>
  <div>
    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.createWallet')"/>
    </div>

    <b-notification v-if="!done" :closable="false" class="has-text-weight-semibold has-text-grey-light">
      <div class="is-flex">
        <b-icon icon="circle-notch" type="is-primary" class="fa-pulse create-wallet-icon"/>
        <p v-html="$i18n.t('createWallet.creatingWallet')"/>
      </div>
    </b-notification>
    <b-notification v-else :closable="false" class="has-text-weight-semibold" type="is-success">
      <div class="is-flex">
        <b-icon icon="check-circle" class="create-wallet-icon"/>
        <p v-html="$i18n.t('createWallet.walletCreated')"/>
      </div>
    </b-notification>

    <b-field align="right">
      <b-button
        v-if="done"
        icon-left="edit"
        :label="$i18n.t('createWallet.goToWallet')"
        type="is-primary"
        @click="$emit('next')"
      />
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'Created',

  props: {
    done: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style>
  .create-wallet-icon {
    width: 30px
  }
</style>
