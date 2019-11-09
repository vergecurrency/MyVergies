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
import { mapActions } from 'vuex'
import constants from '@/utils/constants'

// @ts-ignore
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Buefy)
Vue.component('FaIcon', FontAwesomeIcon)
Vue.prototype.$electron = electron

new Vue({
  router,
  store,
  render: h => h(App),
  methods: {
    ...mapActions(['updatePriceRate']),
    loadData () {
      axios.get(`${constants.priceApi}/eur`)
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
  }
}).$mount('#app')
