export default class ManagerConfig {
  public readonly wallets: WalletConfigItem[]

  constructor (wallets: WalletConfigItem[]) {
    this.wallets = wallets
  }
}

export interface WalletConfigItem {
  name: string
  color: string
  coin: string
  network: string
  paperkey: string
  passphrase: string
  singleAddress: boolean
  vwsApi?: string
}
