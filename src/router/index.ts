import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import WalletView from '@/views/WalletView.vue'
import SendView from '@/views/SendView.vue'
import ReceiveView from '@/views/ReceiveView.vue'
import TransactionView from '@/views/TransactionView.vue'
import WalletCreateView from '@/views/WalletCreateView.vue'
import WalletSettingsView from '@/views/WalletSettingsView.vue'
import ExplorerView from '@/views/ExplorerView.vue'
import ContactsView from '@/views/ContactsView.vue'
import SettingsView from '@/views/SettingsView.vue'

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
    path: '/wallets/:walletName/send',
    name: 'wallets.send',
    component: SendView,
    props: true
  },
  {
    path: '/wallets/:walletName/receive',
    name: 'wallets.receive',
    component: ReceiveView,
    props: true
  },
  {
    path: '/wallets/:walletName/transactions/:txid',
    name: 'wallets.transactions',
    component: TransactionView,
    props: true
  },
  {
    path: '/wallets/:walletName/settings',
    name: 'wallets.settings',
    component: WalletSettingsView,
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
    path: '/settings',
    name: 'settings',
    component: SettingsView
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
