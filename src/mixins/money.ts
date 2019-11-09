import Vue from 'vue'
import constants from '@/utils/constants'

Vue.mixin({
  methods: {
    getFormattedCurrency: (amount: number, lang: string) => {
      return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: lang.includes('de') ? 'EUR' : 'USD'
      }).format(amount)
    },

    getFromattedCrypto: (amount: number, lang: string, coin: any) => {
      return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: coin
      }).format(amount)
    },

    formatAmountFromSatoshis: (satoshis: number, lang: string) => {
      return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: 'XVG'
      }).format(satoshis / 10 ** constants.decimalPerSatoshi)
    }
  }
})
