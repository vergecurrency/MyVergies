import Vue from 'vue'
import VueRouter from 'vue-router'
import WalletView from '../components/WalletView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'wallets',
    component: WalletView
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
