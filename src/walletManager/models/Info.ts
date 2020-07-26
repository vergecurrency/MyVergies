import Balance from '@/walletManager/models/Balance'

export default interface Info {
  name: string
  balance: Balance
  wallet: {
    coin: string
    network: string
    singleAddress: boolean
  }
}
