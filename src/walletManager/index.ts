import Vue, { PluginFunction } from 'vue'
import keytar from 'keytar'
import WalletManager from '@/walletManager/WalletManager'
import ManagerConfig, { WalletConfigItem } from '@/walletManager/ManagerConfig'
import { Store } from 'vuex'

// const wallet = '{"name":"Main Account","color":"blue","coin":"xvg","network":"livenet","paperkey":"","passphrase":"","singleAddress":false}'
// btoa(wallet)

const walletManager: PluginFunction<any> = function (vue: typeof Vue, options: any): void {
  vue.prototype.$walletManager = new WalletManager()

  loadWallets(options.store).then((wallets: WalletConfigItem[]) => {
    vue.prototype.$walletManager.boot(new ManagerConfig(wallets))
  })
}

const loadWallets = async (store: Store<any>): Promise<WalletConfigItem[]> => {
  return Promise.all(store.getters.allWalletNames.map(async (name: string): Promise<WalletConfigItem> => {
    const encrytedWallet = await keytar.getPassword(`MyVergies Wallet: ${name}`, name)

    if (encrytedWallet === undefined) {
      throw Error(`Couldn't load wallet: ${name}`)
    }

    return JSON.parse(atob(encrytedWallet as string))
  }))
}

export default walletManager
