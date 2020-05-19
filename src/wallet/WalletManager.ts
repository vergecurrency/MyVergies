// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import _ from 'lodash'
import Info from '@/wallet/models/Info'
import Wallet from '@/wallet/Wallet'
import ManagerConfig from '@/wallet/ManagerConfig'
import constants from '@/utils/constants'

export default class WalletManager {
  protected config: ManagerConfig
  public readonly wallets: Wallet[] = []

  constructor (config: ManagerConfig) {
    this.config = config
  }

  public async boot () {
    for (const walletConfig of this.config.wallets) {
      const vwc = new Client({
        baseUrl: walletConfig.vwsApi || constants.vwsApi,
        verbose: false
      })

      vwc.seedFromMnemonic(walletConfig.paperkey, {
        coin: walletConfig.coin,
        network: walletConfig.network,
        passphrase: walletConfig.passphrase
      })

      const wallet = new Wallet(walletConfig.name, walletConfig.color, vwc)

      const info = await wallet.open()
      this.wallets.push(wallet)
    }
  }

  public getWallet (name: string): Wallet|undefined {
    return _.find(this.wallets, ['name', name])
  }

  public getWallets (): Wallet[] {
    return this.wallets
  }
}
