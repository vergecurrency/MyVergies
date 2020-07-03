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
      axios.get(`${constants.priceApi}/${this.currentCurrencyCode}`)
        .then(response => {
          // @ts-ignore
          this.updatePriceRate(response.data.price)
        })
    }
  },
  mounted () {
    this.loadData()
    setInterval(() => {
      this.loadData()
    }, 30000)

    this.$i18n.locale = this.currentLanguageCode
  }
}).$mount('#app')
