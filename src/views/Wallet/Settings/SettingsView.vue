<template>
  <div>
    <navigation-header
      :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}"
      :title="$i18n.t('walletSettings.walletSettings')"
    />

    <div class="box">

      <form-section title="Credentials" no-divider>
        <b-message>
          <b-field
            horizontal
            label="Paper key"
          >
            <credential-box :credential="wallet.vwc.credentials.mnemonic"/>
          </b-field>
        </b-message>
      </form-section>

      <form-section :title="$i18n.t('walletSettings.dangerZone')">

        <b-message type="is-danger">
          <b-field
            horizontal
            :label="$i18n.t('walletSettings.delete')"
            message=""
          >
            <div v-html="$i18n.t('walletSettings.deleteWalletDesc')"/>
            <b-button
              type="is-danger"
              :label="$i18n.t('walletSettings.deleteWallet')"
              @click="removeWallet"
            />
          </b-field>
        </b-message>

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
