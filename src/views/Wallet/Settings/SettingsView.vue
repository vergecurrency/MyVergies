<template>
  <div>
    <navigation-header
      :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}"
      :title="$i18n.t('walletSettings.walletSettings')"
    />

    <div class="box">

      <form-section :title="$i18n.t('walletSettings.dangerZone')" no-divider>

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

export default {
  name: 'wallet-settings-view',
  components: { FormSection, NavigationHeader },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeWallet () {
      this.$buefy.dialog.confirm({
        message: new Option(this.$i18n.t('walletSettings.deleteWalletConfirm', { name: this.wallet.name })).innerHTML,
        onConfirm: this.handleRemovingWallet
      })
    },

    handleRemovingWallet () {
      this.$walletManager.removeWallet(this.wallet).then(succeeded => {
        if (succeeded) {
          this.removeWalletName(this.wallet.name)

          this.$router.push({ name: 'wallets.create' })

          this.$buefy.toast.open({
            message: new Option(this.$i18n.t('walletSettings.walletDeleted', { name: this.wallet.name })).innerHTML,
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
