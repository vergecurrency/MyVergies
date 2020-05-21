import Vue, { PluginFunction } from 'vue'
import keytar from 'keytar'
import WalletManager from '@/walletManager/WalletManager'
import ManagerConfig, { WalletConfigItem } from '@/walletManager/ManagerConfig'
import { Store } from 'vuex'

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

    // TODO: descrypt the encrypted json wallet data.
    const jsonWallet: string = encrytedWallet as string
    const wallet: WalletConfigItem = JSON.parse(jsonWallet)

    return wallet
  }))
}

export default walletManager
