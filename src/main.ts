import messages from './utils/i18n'
import Vue from 'vue'
import axios from 'axios'
import electron from 'electron'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import Buefy from 'buefy'
import '@/mixins'
import '@/icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapActions, mapGetters } from 'vuex'
import constants from './utils/constants'
import VueI18n from 'vue-i18n'
import '@/wallet'

// @ts-ignore
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Buefy, {
  defaultIconComponent: 'fa-icon',
  defaultIconPack: 'fas'
})
Vue.component('fa-icon', FontAwesomeIcon)
Vue.prototype.$electron = electron
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: messages
})

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
