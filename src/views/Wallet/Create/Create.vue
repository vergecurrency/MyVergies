<template>
  <div>
    <div class="block">
      <div v-if="!confirmed">
        <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.almostReady')"/>
        <p v-html="$i18n.t('createWallet.almostReadyDesc')"/>
      </div>
      <h3 v-else class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.createWallet')"/>
    </div>

    <div v-if="!confirmed">
      <b-field class="box">
        <b-switch
          v-model="agreedTerm1"
        >
          <span v-html="$i18n.t('createWallet.createTerm1')"/>
        </b-switch>
      </b-field>
      <b-field class="box">
        <b-switch
          v-model="agreedTerm2"
        >
          <span v-html="$i18n.t('createWallet.createTerm2')"/>
        </b-switch>
      </b-field>
      <b-field class="box">
        <b-switch
          v-model="agreedTerm3"
        >
          <span v-html="$i18n.t('createWallet.createTerm3')"/>
        </b-switch>
      </b-field>

      <b-field grouped>
        <b-field expanded>
          <b-button v-html="$i18n.t('createWallet.termsOfUse')" @click="showTermsOfUse"/>
        </b-field>
        <b-field>
          <b-button
            v-if="isConfirmed"
            v-html="$i18n.t('createWallet.createWallet')"
            type="is-primary"
            icon-left="plus"
            @click="createWallet"
          />
        </b-field>
      </b-field>
    </div>
    <b-notification v-else-if="confirmed && !done" :closable="false" class="has-text-weight-semibold has-text-grey-light">
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
import constants from '@/utils/constants'
import { shell } from 'electron'

export default {
  name: 'Created',

  props: {
    done: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      agreedTerm1: false,
      agreedTerm2: false,
      agreedTerm3: false,
      confirmed: false
    }
  },

  computed: {
    isConfirmed () {
      return this.agreedTerm1 && this.agreedTerm2 && this.agreedTerm3
    }
  },

  methods: {
    createWallet () {
      this.confirmed = true

      this.$emit('createWallet')
    },

    showTermsOfUse () {
      this.$buefy.dialog.confirm({
        message: this.$i18n.t('createWallet.openTermsOfUseConfirm'),
        onConfirm: () => {
          shell.openExternal(constants.termsOfUse)
        }
      })
    }
  }
}
</script>

<style>
  .create-wallet-icon {
    width: 30px
  }
</style>
