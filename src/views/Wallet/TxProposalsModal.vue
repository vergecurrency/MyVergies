<template>
  <div class="modal-card">
    <div class="modal-card-head is-warning">
      <h3 class="modal-card-title" v-html="$i18n.t('wallet.transactionProposals')"/>
    </div>
    <div class="modal-card-body">
      <b-field>
        <p v-html="$i18n.t('wallet.transactionProposalsDesc')"/>
      </b-field>

      <div class="box is-paddingless">
        <div
          v-for="txp in wallet.txProposals"
          :key="txp.id"
          class="p-3"
          style="border-bottom: 1px solid #00000050"
        >
          <div class="columns is-vcentered">
            <div class="column">
              <p v-html="txp.id" class="has-text-weight-bold" />
              <p class="has-text-primary">
                [<span v-html="txp.status" />] -
                <money :amount="txp.amount" crypto />
              </p>
            </div>
            <div class="column is-narrow">
              <b-button type="is-danger" icon-left="trash" @click="removeTxp(txp)" />
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <b-button @click="$parent.close()" :label="$i18n.t('wallet.done')"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Money from '@/components/labels/Money'
import Log from 'electron-log'

export default {
  name: 'TxProposalsModal',
  components: { Money },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTxp (txp) {
      this.$buefy.dialog.confirm({
        message: this.$i18n.t('wallet.confirmTxProposalRemoval', { txp: txp.id }),
        confirmText: this.$i18n.t('wallet.remove'),
        type: 'is-danger',
        hasIcon: true,
        icon: 'trash',
        onConfirm: () => {
          Log.info(`Transaction proposal '${txp.id}' removal requested`)

          this.wallet.removeTxProposal(txp).catch(e => {
            Log.error(`Transaction proposal '${txp.id}' removal failed`, e)

            this.$buefy.dialog.alert(e.message)
          })
        }
      })
    }
  }
}
</script>
