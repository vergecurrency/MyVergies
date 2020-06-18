export default interface AddressInfo {
  address: string
  beRegistered?: boolean
  coin: string
  createdOn: number
  isChange: boolean
  network: string
  path: string
  publicKeys: string[]
  type: string
  version: string
  walletId: string
}
