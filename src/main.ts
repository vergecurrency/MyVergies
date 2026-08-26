import Vue from 'vue'
import axios from 'axios'
import electron from 'electron'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/locale'
import '@/mixins'
import '@/icons'
import { mapActions, mapGetters } from 'vuex'
import constants from './utils/constants'
import walletManager from '@/walletManager'
import authManager from '@/authentication'
import { ensureTorProxyState, markPrimaryApiReady } from '@/utils/torStartup'
import { fetchXvgPrice } from '@/utils/priceApi'

const PRICE_REFRESH_INTERVAL_MS = 60000

Vue.use(walletManager, { store })
Vue.use(authManager)
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$electron = electron

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  computed: {
    ...mapGetters(['currentLanguageCode', 'currentCurrencyCode'])
  },
  methods: {
    ...mapActions(['updatePriceRate']),
    loadData () {
      return fetchXvgPrice(this.currentCurrencyCode).then(price => {
        // @ts-ignore
        this.updatePriceRate(price)
      })
    }
  },
  async mounted () {
    try {
      await ensureTorProxyState(this.$store.getters.isTorEnabled)
    } finally {
      markPrimaryApiReady()
    }

    setInterval(() => {
      this.loadData().catch(() => undefined)
    }, PRICE_REFRESH_INTERVAL_MS)

    this.loadData().catch(() => undefined)

    this.$i18n.locale = this.currentLanguageCode
  }
}).$mount('#app')
