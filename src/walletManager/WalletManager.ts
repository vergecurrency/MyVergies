// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import keytar from 'keytar'
import _ from 'lodash'
import Info from '@/walletManager/models/Info'
import Wallet from '@/walletManager/Wallet'
import ManagerConfig, { WalletConfigItem } from '@/walletManager/ManagerConfig'
import constants from '@/utils/constants'

export default class WalletManager {
  protected config?: ManagerConfig
  public readonly wallets: Wallet[] = []

  public async boot (config: ManagerConfig) {
    this.config = config

    for (const walletConfig of this.config.wallets) {
      const vwc = this.getClient(walletConfig)
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

  public async addWallet (walletConfig: WalletConfigItem) {
    const vwc = this.getClient(walletConfig)
    const wallet = new Wallet(walletConfig.name, walletConfig.color, vwc)

    await wallet.create(walletConfig.name, walletConfig.name, 1, 1, {
      coin: walletConfig.coin,
      network: walletConfig.network,
      singleAddress: walletConfig.singleAddress
    })
    await wallet.status()
    await keytar.setPassword(`MyVergies Wallet: ${walletConfig.name}`, walletConfig.name, btoa(JSON.stringify(walletConfig)))
    this.wallets.push(wallet)

    return wallet
  }

  protected getClient (walletConfig: WalletConfigItem): Client {
    const vwc = new Client({
      baseUrl: walletConfig.vwsApi || 'http://localhost:3232/vws/api', // || constants.vwsApi,
      verbose: false
    })

    vwc.seedFromMnemonic(walletConfig.paperkey, {
      coin: walletConfig.coin,
      network: walletConfig.network,
      passphrase: walletConfig.passphrase
    })

    return vwc
  }
}
