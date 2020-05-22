// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import Wallet from '@/walletManager/Wallet'
import ManagerConfig, { WalletConfigItem } from '@/walletManager/ManagerConfig'
import constants from '@/utils/constants'
import keytar from '@/utils/keytar'

export default class WalletManager {
  protected config?: ManagerConfig
  public readonly wallets: Wallet[] = []

  public async boot (config: ManagerConfig) {
    this.config = config

    for (const walletConfig of this.config.wallets) {
      const vwc = this.getClient(walletConfig)
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

  public async addWallet (walletConfig: WalletConfigItem) {
    const vwc = this.getClient(walletConfig)
    const wallet = new Wallet(walletConfig.name, walletConfig.color, vwc)

    await wallet.create(walletConfig.name, walletConfig.name, 1, 1, {
      coin: walletConfig.coin,
      network: walletConfig.network,
      singleAddress: walletConfig.singleAddress
    })
    await wallet.status()
    await keytar.setCredentials(`MyVergies Wallet: ${wallet.name}`, walletConfig.name, btoa(JSON.stringify(walletConfig)))
    this.wallets.push(wallet)

    return wallet
  }

  public async removeWallet (wallet: Wallet): Promise<boolean> {
    const succeeded = await keytar.deleteCredentials(`MyVergies Wallet: ${wallet.name}`, wallet.name!)

    if (succeeded) {
      this.wallets.splice(this.wallets.findIndex(w => w === wallet), 1)
    }

    return succeeded
  }

  protected getClient (walletConfig: WalletConfigItem): Client {
    const vwc = new Client({
      baseUrl: walletConfig.vwsApi || constants.vwsApi,
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
