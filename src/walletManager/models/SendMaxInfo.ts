import {UnspentOutput} from '@/walletManager/models/TxProposal'

export default interface SendMaxInfo {
  size: number
  amount: number
  fee: number
  feePerKb: number
  inputs: UnspentOutput[]
  utxosBelowFee: number
  amountBelowFee: number
  utxosAboveMaxSize: number
  amountAboveMaxSize: number
}
