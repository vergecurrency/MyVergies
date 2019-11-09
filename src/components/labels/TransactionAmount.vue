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
          return `- ${amount}`
        case 'received':
          return `+ ${amount}`
        case 'moved':
        default:
          return amount
      }
    },

    amountColor () {
      switch (this.action) {
        case 'sent':
          return 'has-text-danger'
        case 'received':
          return 'has-text-success'
        case 'moved':
        default:
          return 'has-text-grey-light'
      }
    }
  }
}
</script>
