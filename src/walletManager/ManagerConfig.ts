export default class ManagerConfig {
  public readonly wallets: WalletConfigItem[]

  constructor (wallets: WalletConfigItem[]) {
    this.wallets = wallets
  }
}

export type WalletBackend = 'vws' | 'electrumx'

export interface ElectrumDiscoveryState {
  discoveredExternalCount: number
  discoveredChangeCount: number
  nextExternalIndex: number
  nextChangeIndex: number
}

export interface WalletConfigItem {
  identifier: string
  name: string
  color: string
  backend?: WalletBackend
  coin: string
  network: string
  paperkey: string
  passphrase: string
  mnemonicPassphrase?: string
  walletPrivKey?: string
  singleAddress: boolean
  vwsApi?: string
  electrumServer?: string
  electrumState?: ElectrumDiscoveryState
}
