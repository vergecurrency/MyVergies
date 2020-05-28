// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import Log from 'electron-log'
import Wallet from '@/walletManager/Wallet'
import ManagerConfig, { WalletConfigItem } from '@/walletManager/ManagerConfig'
import constants from '@/utils/constants'
import keytar from '@/utils/keytar'
import Timeout = NodeJS.Timeout

export default class WalletManager {
  protected config?: ManagerConfig
  protected ticker?: Timeout

  public readonly wallets: Wallet[] = []

  public async boot (config: ManagerConfig) {
    this.config = config

    for (const walletConfig of this.config.wallets) {
      try {
        const vwc = this.getClient(walletConfig)
        const wallet = new Wallet(walletConfig.name, walletConfig.color, vwc)
        await wallet.open()

        this.wallets.push(wallet)
      } catch (e) {
        Log.error(e.toString())
      }
    }

    this.startTicker()
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
    await keytar.setCredentials(keytar.walletService(), walletConfig.name, btoa(JSON.stringify(walletConfig)))
    this.wallets.push(wallet)

    return wallet
  }

  public async removeWallet (wallet: Wallet): Promise<boolean> {
    const succeeded = await keytar.deleteCredentials(keytar.walletService(), wallet.name!)

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

  protected startTicker () {
    const fetch = async () => {
      for (const wallet of this.wallets) {
        try {
          await wallet.status()
          await wallet.fetchTxHistory()
        } catch (e) {
          Log.error(e.toString())
        }
      }
    }

    this.ticker = setInterval(fetch, 30000)

    fetch()
  }

  protected stopTicker () {
    if (this.ticker) {
      clearInterval(this.ticker)
    }
  }
}
