<template>
  <div>
    <div class="block">
      <div v-if="!confirmed && !skipConfirmation">
        <h3 class="is-size-3 is-family-display create-flow-title" v-html="$i18n.t('createWallet.almostReady')"/>
        <p v-html="$i18n.t('createWallet.almostReadyDesc')"/>
      </div>
      <h1 v-else class="title is-family-display create-flow-title" v-html="$i18n.t('createWallet.awesomeYouveDoneIt')"/>
    </div>

    <div v-if="!confirmed && !skipConfirmation">
      <b-field v-if="showStaticAddressOption" class="box">
        <b-switch v-model="localSingleAddress" @input="updateSingleAddress">
          <span class="has-text-weight-semibold">Use a static receive address</span>
        </b-switch>
        <p class="help create-static-address-help">
          Keep your restored ElectrumX wallet on one receive address instead of rotating to the next unused address.
        </p>
      </b-field>

      <b-field class="box">
        <b-switch
          v-model="agreedTerm1"
        >
          <span v-html="createTerm1Text"/>
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
    <b-notification v-else-if="confirmed || skipConfirmation" :closable="false" class="has-text-weight-semibold has-text-grey-light">
      <div v-if="!done" class="is-flex">
        <b-icon icon="circle-notch" type="is-primary" class="fa-pulse create-wallet-icon"/>
        <p v-html="$i18n.t('createWallet.creatingWallet')"/>
      </div>
      <div v-else class="has-text-success is-flex wallet-created">
        <b-icon icon="check-circle" class="create-wallet-icon" size="is-large"/>
        <p v-html="$i18n.t('createWallet.walletCreated')"/>
      </div>
    </b-notification>

    <div v-if="(confirmed || skipConfirmation) && done">
      <h3 class="is-size-3 is-family-display create-flow-title" v-html="$i18n.t('createWallet.whatToDoNext')"/>
      <div class="box has-background-warning">
        <div class="columns is-vcentered">
          <div class="column">
            <h4 class="has-text-weight-semibold" v-html="$i18n.t('createWallet.exportYourWallet')"/>
            <p v-html="$i18n.t('createWallet.exportYourWalletDesc')"/>
          </div>
          <div class="column is-narrow">
            <b-button @click="exportWallet" v-html="$i18n.t('createWallet.exportWallet')"/>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="columns is-vcentered">
          <div class="column">
            <h4 class="has-text-weight-semibold" v-html="$i18n.t('createWallet.sendXvgToYourWallet')"/>
            <p v-html="$i18n.t('createWallet.sendXvgToYourWalletDesc')"/>
          </div>
          <div class="column is-narrow">
            <b-button @click="$emit('next', { route: 'wallets.receive' })" v-html="$i18n.t('createWallet.receiveXvg')"/>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="columns is-vcentered">
          <div class="column">
            <h4 class="has-text-weight-semibold" v-html="$i18n.t('createWallet.orGoToWallet')"/>
            <p v-html="$i18n.t('createWallet.orGoToWalletDesc')"></p>
          </div>
          <div class="column is-narrow">
            <b-button
              v-if="done"
              icon-left="edit"
              :label="$i18n.t('createWallet.goToWallet')"
              type="is-primary"
              @click="$emit('next', { route: 'wallets' })"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import constants from '@/utils/constants'
import { shell } from 'electron'
import ExportModal from '@/views/Wallet/Settings/ExportModal'

export default {
  name: 'Create',

  props: {
    done: {
      type: Boolean,
      required: true
    },

    skipConfirmation: {
      type: Boolean,
      required: false
    },

    wallet: {
      type: Object,
      default: null
    },

    restore: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      agreedTerm1: false,
      agreedTerm2: false,
      agreedTerm3: false,
      confirmed: false,
      localSingleAddress: false
    }
  },

  computed: {
    showStaticAddressOption () {
      return this.restore && this.wallet && this.wallet.backend === 'electrumx'
    },
    createTerm1Text () {
      if (this.wallet && this.wallet.backend === 'electrumx') {
        return 'I understand that the only way to restore this wallet is by providing the <b>18-word recovery phrase</b> and the optional <b>BIP39 seed passphrase</b> if I set one. If these credentials are lost, there is no recovery path.'
      }

      return this.$i18n.t('createWallet.createTerm1')
    },
    isConfirmed () {
      return (this.agreedTerm1 && this.agreedTerm2 && this.agreedTerm3) || this.skipConfirmation
    }
  },

  watch: {
    wallet: {
      immediate: true,
      handler (wallet) {
        this.localSingleAddress = wallet && wallet.singleAddress === true
      }
    }
  },

  methods: {
    updateSingleAddress (singleAddress) {
      this.$emit('update-wallet', {
        ...this.wallet,
        singleAddress
      })
    },

    createWallet () {
      this.confirmed = true

      this.$emit('create-wallet')
    },

    showTermsOfUse () {
      this.$buefy.dialog.confirm({
        message: this.$i18n.t('createWallet.openTermsOfUseConfirm'),
        onConfirm: () => {
          shell.openExternal(constants.termsOfUse)
        }
      })
    },

    exportWallet () {
      this.$buefy.modal.open({
        component: ExportModal,
        parent: this,
        hasModalCard: true,
        canCancel: ['escape', 'outside'],
        props: {
          wallet: this.wallet
        }
      })
    }
  }
}
</script>

<style>
  .create-flow-title {
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--rv-text);
    text-shadow:
      0 0 10px rgba(124, 255, 242, 0.18),
      0 0 24px rgba(50, 239, 222, 0.24);
  }

  .create-wallet-icon {
    width: 30px
  }
  .notification .wallet-created {
    flex-direction: column;
    align-items: center;
  }

  .create-static-address-help {
    margin-top: 0.5rem;
  }
</style>
