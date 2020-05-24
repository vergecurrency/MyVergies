import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import WalletView from '@/views/Wallet/WalletView.vue'
import SendView from '@/views/Wallet/Send/SendView.vue'
import ReceiveView from '@/views/Wallet/Receive/ReceiveView.vue'
import TransactionView from '@/views/Wallet/Transaction/TransactionView.vue'
import WalletCreateView from '@/views/Wallet/Create/CreateView.vue'
import WalletSetupView from '@/views/Wallet/Create/WalletSetupView.vue'
import WalletSettingsView from '@/views/Wallet/Settings/SettingsView.vue'
import ExplorerView from '@/views/Explorer/ExplorerView.vue'
import ContactsView from '@/views/Contacts/ContactsView.vue'
import SettingsView from '@/views/Settings/SettingsView.vue'

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
    path: '/wallets/create/new',
    name: 'wallets.create.new',
    component: WalletSetupView
  },
  {
    path: '/wallets/create/restore',
    name: 'wallets.create.restore',
    component: WalletSetupView,
    props: true
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
