// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import Wallet from '@/walletManager/Wallet'
import ManagerConfig from '@/walletManager/ManagerConfig'
import constants from '@/utils/constants'

export default class WalletManager {
  protected config?: ManagerConfig
  public readonly wallets: Wallet[] = []

  public async boot (config: ManagerConfig) {
    this.config = config

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

      await wallet.open()
      this.wallets.push(wallet)
    }
  }

  public getWallet (name: string): Wallet | undefined {
    return this.wallets.find((wallet) => wallet.name === name)
  }

  public getWallets (): Wallet[] {
    return this.wallets
  }
}
