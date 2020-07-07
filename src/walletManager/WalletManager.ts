// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import Log from 'electron-log'
import Wallet from '@/walletManager/Wallet'
import ManagerConfig, { WalletConfigItem } from '@/walletManager/ManagerConfig'
import constants from '@/utils/constants'
import Keytar from '@/utils/keytar'
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
    await wallet.open()
    await Keytar.setCredentials(Keytar.walletService, walletConfig.name, btoa(JSON.stringify(walletConfig)))
    this.wallets.push(wallet)

    this.restartTicker()

    return wallet
  }

  public async updateWallet (name: string, wallet: Wallet): Promise<Wallet> {
    const walletConfig = await this.getWalletConfig(name)
    // @ts-ignore
    walletConfig.vwsApi = wallet.vwc.request.baseUrl
    walletConfig.name = wallet.name!
    walletConfig.color = wallet.color!

    const encryptedWallet = btoa(JSON.stringify(walletConfig))

    await Keytar.setCredentials(Keytar.walletService, walletConfig.name, encryptedWallet)

    if (name !== wallet.name) {
      await Keytar.deleteCredentials(Keytar.walletService, name)
    }

    this.restartTicker()

    return wallet
  }

  public async removeWallet (wallet: Wallet): Promise<boolean> {
    const succeeded = await Keytar.deleteCredentials(Keytar.walletService, wallet.name!)

    if (succeeded) {
      this.wallets.splice(this.wallets.findIndex(w => w === wallet), 1)
    }

    return succeeded
  }

  // TODO: function will only return passphrase when application unlocked.
  public async getWalletPassphrase (wallet: Wallet): Promise<string> {
    const walletConfig = await this.getWalletConfig(wallet.name!)

    return walletConfig.passphrase
  }

  protected getClient (walletConfig: WalletConfigItem): Client {
    const vwc = new Client({
      baseUrl: walletConfig.vwsApi || constants.vwsApi,
      verbose: false
    })

    vwc.seedFromMnemonic(walletConfig.paperkey, walletConfig)

    return vwc
  }

  protected async getWalletConfig (name: string): Promise<WalletConfigItem> {
    const encrytedWallet = await Keytar.getCredentials(Keytar.walletService, name)

    if (encrytedWallet === undefined) {
      throw Error(`Couldn't load wallet: ${name}`)
    }

    return JSON.parse(atob(encrytedWallet as string))
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

  protected restartTicker () {
    this.stopTicker()
    this.startTicker()
  }
}
