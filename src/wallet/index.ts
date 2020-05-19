import Vue from 'vue'
import fs from 'fs'
import WalletManager from '@/wallet/WalletManager'
import Wallet from '@/wallet/Wallet'
import ManagerConfig, { WalletConfigItem } from '@/wallet/ManagerConfig'

let wallets: WalletConfigItem[] = []

try {
  wallets = require('@/assets/data/example/wallets')
} catch (e) {
  // It's okay fallback to no wallets :)
  // Fill the wallets.json file with a valid wallet.
}

const config = new ManagerConfig(wallets)
const walletManager = Vue.prototype.$walletManager = new WalletManager(config)

walletManager.boot()
