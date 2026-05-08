import Balance from '@/walletManager/models/Balance'

export default interface Info {
  name: string
  balance: Balance
  wallet: {
    backend?: 'vws' | 'electrumx'
    coin: string
    network: string
    singleAddress: boolean
    supportsSending?: boolean
    electrumConnected?: boolean
    electrumServer?: string
  }
}
