import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import './icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapActions } from 'vuex'

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
      fetch('https://api.coinpaprika.com/v1/ticker/xvg-verge')
        .then((response) => response.json())
        .then((priceObj) =>
          this.updatePriceRate(priceObj.price_usd)
        )
    }
  },
  mounted () {
    this.loadData()
    setInterval(() => {
      this.loadData()
    }, 10000)
  }
}).$mount('#app')
