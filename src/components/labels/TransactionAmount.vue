<template>
 <div :class="amountColor">
   {{ amountFormatted }}
 </div>
</template>

<script>
export default {
  name: 'transaction-amount',
  props: {
    action: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  computed: {
    amountFormatted () {
      let amount = this.formatAmountFromSatoshis(this.amount, this.$electron.remote.app.getLocale())

      switch (this.action) {
        case 'sent':
        case 'sending':
          return `- ${amount}`
        case 'received':
        case 'receiving':
          return `+ ${amount}`
        case 'moved':
        case 'pending':
        default:
          return amount
      }
    },

    amountColor () {
      switch (this.action) {
        case 'sent':
        case 'sending':
          return 'has-text-danger'
        case 'received':
        case 'receiving':
          return 'has-text-success'
        case 'moved':
        case 'pending':
        default:
          return 'has-text-grey-light'
      }
    }
  }
}
</script>
