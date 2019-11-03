import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import './icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapActions } from 'vuex'
import constants from './utils/constants'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Buefy)
Vue.component('FaIcon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  methods: {
    ...mapActions(['updatePriceRate']),
    loadData () {
      axios.get(`${constants.priceApi}/eur`)
        .then(response => {
          this.updatePriceRate(response.data.price)
        })
    }
  },
  mounted () {
    this.loadData()
    setInterval(() => {
      this.loadData()
    }, 30000)
  }
}).$mount('#app')
