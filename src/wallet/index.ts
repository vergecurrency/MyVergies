import Vue from 'vue'
import fs from 'fs'
import keytar from 'keytar'
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

// wallets.forEach(wallet => {
//   keytar.setPassword(`MyVergies Wallet: ${wallet.name}`, 'credentials', JSON.stringify({
//     paperkey: wallet.paperkey,
//     passphrase: wallet.passphrase
//   }))
// })

// const paperkey = keytar.getPassword('myvergies.wallet.name', 'paperkey')
// const passphrase = keytar.getPassword('myvergies.wallet.name', 'passphrase')
//
// paperkey.then(secret => {
//   console.log(secret)
// })
//
// passphrase.then(secret => {
//   console.log(secret)
// })

const config = new ManagerConfig(wallets)
const walletManager = Vue.prototype.$walletManager = new WalletManager(config)

walletManager.boot()
