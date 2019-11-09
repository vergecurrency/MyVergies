import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import WalletView from '@/views/WalletView.vue'
import WalletCreateView from '@/views/WalletCreateView.vue'
import ExplorerView from '@/views/ExplorerView.vue'
import ContactsView from '@/views/ContactsView.vue'

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
    path: '/wallets/create',
    name: 'wallets.create',
    component: WalletCreateView
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: ExplorerView
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: ContactsView
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
