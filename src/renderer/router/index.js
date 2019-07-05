import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'wallets',
      component: require('@/components/Wallets').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
