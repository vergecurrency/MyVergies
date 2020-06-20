<template>
  <div>
    <navigation-header
      :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}"
      :title="$i18n.t('walletSettings.walletSettings')"
    />

    <div class="box">

      <form-section
        :title="$i18n.t('walletSettings.service')"
        no-divider
        >
        <div class="box has-background-info-light">
          <div class="columns is-vcentered">
            <div class="column">
              <h4 class="has-text-weight-semibold" v-html="$i18n.t('walletSettings.serviceUrl')"/>
              <p v-html="$i18n.t('walletSettings.serviceUrlDesc')"/>
            </div>
            <div class="column">
              <b-input v-model="wallet.vwc.request.baseUrl"/>
            </div>
          </div>
        </div>
      </form-section>

      <form-section
        :title="$i18n.t('walletSettings.credentials')"
      >
        <div class="box">
          <div class="columns is-vcentered">
            <div class="column">
              <h4 class="has-text-weight-semibold" v-html="$i18n.t('walletSettings.paperKey')"/>
              <p v-html="$i18n.t('createWallet.aPaperKeyDescription')"/>
            </div>
            <div class="column">
              <credential-box :credential="wallet.vwc.credentials.mnemonic"/>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="columns is-vcentered">
            <div class="column">
              <h4 class="has-text-weight-semibold" v-html="$i18n.t('walletSettings.passphrase')"/>
              <p v-html="$i18n.t('walletSettings.passphraseDesc')"/>
            </div>
            <div class="column is-narrow">
              <b-button v-html="$i18n.t('walletSettings.showPassphrase')" type="is-primary" @click="showPassphrase"/>
            </div>
          </div>
        </div>

        <div class="box has-background-warning">
          <div class="columns is-vcentered">
            <div class="column">
              <h4 class="has-text-weight-semibold" v-html="$i18n.t('createWallet.exportYourWallet')"/>
              <p v-html="$i18n.t('createWallet.exportYourWalletDesc')"/>
            </div>
            <div class="column is-narrow">
              <b-button v-html="$i18n.t('createWallet.exportWallet')"/>
            </div>
          </div>
        </div>
      </form-section>

      <form-section
        :title="$i18n.t('walletSettings.dangerZone')"
      >
        <div class="box has-background-danger has-text-light">
          <div class="columns is-vcentered">
            <div class="column">
              <h4 class="has-text-weight-semibold" v-html="$i18n.t('walletSettings.delete')"/>
              <p v-html="$i18n.t('walletSettings.deleteWalletDesc')"/>
            </div>
            <div class="column is-narrow">
              <b-button
                v-html="$i18n.t('walletSettings.deleteWallet')"
                @click="removeWallet"
              />
            </div>
          </div>
        </div>
      </form-section>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import FormSection from '@/components/layout/FormSection'
import { mapActions } from 'vuex'
import CredentialBox from '@/components/CredentialBox'

export default {
  name: 'wallet-settings-view',
  components: { CredentialBox, FormSection, NavigationHeader },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },
  methods: {
    showPassphrase () {
      this.$walletManager.getWalletPassphrase(this.wallet).then(passphrase => {
        this.$buefy.dialog.alert({
          message: `<div class="box has-background-warning"><h4 class="has-text-weight-semibold">${this.$i18n.t('walletSettings.yourWalletsPassphrase')}:</h4><p>${passphrase}</p></div>`
        })
      }).catch(e => {
        this.$buefy.dialog.alert(e.message)
      })
    },

    removeWallet () {
      this.$buefy.dialog.confirm({
        message: this.$i18n.t('walletSettings.deleteWalletConfirm', { name: this.wallet.name }),
        onConfirm: this.handleRemovingWallet
      })
    },

    handleRemovingWallet () {
      this.$walletManager.removeWallet(this.wallet).then(succeeded => {
        if (succeeded) {
          this.removeWalletName(this.wallet.name)

          this.$router.push({ name: 'wallets.create' })

          this.$buefy.toast.open({
            message: this.$i18n.t('walletSettings.walletDeleted', { name: this.wallet.name }),
            type: 'is-success'
          })
        }
      })
    },

    ...mapActions(['removeWalletName'])
  }
}
</script>

<style scoped></style>
