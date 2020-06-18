export interface TxProposal {
  txProposalId?: string
  outputs: TxProposalOutput[]
  message?: string
  feeLevel?: number
  feePerKb?: number
  changeAddress?: string
  sendMax?: boolean
  payProUrl?: string
  excludeUnconfirmedUtxos?: boolean
  validateOutputs?: boolean
  dryRun?: boolean
  fee?: number
  noShuffleOutputs?: boolean
}

export interface TxProposalOutput {
  toAddress: string
  amount: number
  message: string
}

export interface TxProposalResponse {
  createdOn?: number
  coin: string
  id: string
  network: string
  message?: string
  inputs: UnspentOutput[]
  fee: number
  status: string
  creatorId: string
  walletN: number
  walletM: number
  outputs: TxOutput[]
  amount: number
  changeAddress: TxChangeAddress
  walletId: string
  requiredSignatures: number
  version: number
  excludeUnconfirmedUtxos: boolean
  addressType: string
  requiredRejections: number
  outputOrder: number[]
  inputPaths: string[]
}

export interface UnspentOutput {
  address: string
  confirmations: number
  satoshis: number
  scriptPubKey: string
  txID: string
  vout: number
  publicKeys: string[]
  path: string
  locked: boolean
}

export interface TxOutput {
  message?: string
  encryptedMessage?: string
  toAddress: string
  ephemeralPrivKey?: string
  stealth?: boolean
}

export interface TxChangeAddress {
  isChange: boolean
  coin: string
  publicKeys: string[]
  type: string
  version: string
  path: string
  walletId: string
  createdOn: number
  network: string
  address: string
}
