<template>
  <p v-html="amountFormatted" />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'money',
  props: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'XVG'
    },
    crypto: {
      type: Boolean,
      default: false
    },
    convert: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['currentRate']),

    amountFormatted: function () {
      if (this.crypto) {
        return this.getFromattedCrypto(this.amount, this.$electron.remote.app.getLocale(), this.currency)
      }

      if (this.convert) {
        const amount = this.amount * this.currentRate
        return this.getFormattedCurrency(amount, this.$electron.remote.app.getLocale())
      }

      return ''
    }
  }
}
</script>
