export default interface Tx {
  id: string
  txid: string
  confirmations: number
  blockheight: number
  fees: number
  time: number
  size: number
  action: string
  amount: number
  addressTo?: boolean
  outputs: TxOutput[]
  createdOn?: number
  proposalId?: string
  creatorName?: string
  actions?: TxAction[]
}

export interface TxOutput {
  address: boolean
  amount: number
}

export interface TxAction {
  createdOn: number
  type: string
  copayerId: string
  copayerName: string
}
