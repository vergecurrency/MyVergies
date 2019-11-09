import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import WalletView from '@/views/WalletView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/wallets/:walletName',
    name: 'wallets',
    component: WalletView,
    props: true
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
