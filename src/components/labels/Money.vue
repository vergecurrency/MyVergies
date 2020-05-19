<template>
  <p v-html="amountFormatted" />
</template>

<script>
import { mapGetters } from 'vuex'
import constants from '@/utils/constants'

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
    ...mapGetters(['currentRate', 'currentCurrencyCode']),

    amountFormatted: function () {
      if (this.crypto) {
        return this.getFromattedCrypto(this.amount / constants.satoshiDivider, this.$electron.remote.app.getLocale(), this.currency)
      }

      if (this.convert) {
        const amount = (this.amount / constants.satoshiDivider) * this.currentRate
        return this.getFormattedCurrency(amount, this.$electron.remote.app.getLocale(), this.currentCurrencyCode)
      }

      return ''
    }
  }
}
</script>
