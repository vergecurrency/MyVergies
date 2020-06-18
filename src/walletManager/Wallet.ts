// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import Info from '@/walletManager/models/Info'
import Balance from '@/walletManager/models/Balance'
import Tx from '@/walletManager/models/Tx'
import { TxProposal, TxProposalResponse } from '@/walletManager/models/TxProposal'

export default class Wallet {
  protected vwc: Client
  public name?: string
  public color?: string
  public info?: Info
  public transactions: Tx[] = []

  constructor (name: string, color: string, vwc: Client) {
    this.name = name
    this.color = color
    this.vwc = vwc
  }

  public async create (name: string, copayerName: string, m: number = 1, n: number = 1, options: object = {}) {
    try {
      // First check if the wallet is already on the server.
      // If not we create the wallet after getting an error.
      const status = await this.status()

      return status
    } catch (e) {
      return new Promise((resolve, reject) => {
        this.vwc.createWallet(name, copayerName, m, n, options, (error: Error|null, secret: string|null) => {
          if (error) {
            return reject(error)
          }

          resolve(secret)
        })
      })
    }
  }

  public open (): Promise<Info> {
    return new Promise((resolve, reject) => {
      this.vwc.openWallet((error: Error, info: Info) => {
        if (error) {
          return reject(error)
        }

        this.info = info

        resolve(info)
      })
    })
  }

  public status (): Promise<Info> {
    return new Promise((resolve, reject) => {
      this.vwc.getStatus({ includeExtendedInfo: true }, (error: Error, info: Info) => {
        if (error) {
          return reject(error)
        }

        this.info = info

        resolve(info)
      })
    })
  }

  public fetchBalance (): Promise<Balance> {
    return new Promise((resolve, reject) => {
      this.vwc.getBalance((error: Error|null, balance: Balance) => {
        if (error) {
          return reject(error)
        }

        resolve(balance)
      })
    })
  }

  public scan (name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.vwc.startScan({}, (error: Error|null) => {
        if (error) {
          return reject(error)
        }

        resolve(true)
      })
    })
  }

  public fetchTxHistory (): Promise<Tx[]> {
    return new Promise((resolve, reject) => {
      this.vwc.getTxHistory({ includeExtendedInfo: true }, (error: Error|null, txs: Tx[]) => {
        if (error) {
          return reject(error)
        }

        this.transactions = txs

        resolve(txs)
      })
    })
  }

  public getTxHistory (): Tx[] {
    return this.transactions
  }

  public createTxProposal (proposal: TxProposal): Promise<TxProposalResponse> {
    return new Promise((resolve, reject) => {
      this.vwc.createTxProposal(proposal, (error: Error|null, txp: TxProposalResponse) => {
        if (error) {
          return reject(error)
        }

        resolve(txp)
      })
    })
  }

  public publishTxProposal (proposal: TxProposalResponse): Promise<TxProposalResponse> {
    return new Promise((resolve, reject) => {
      this.vwc.publishTxProposal({ txp: proposal }, (error: Error|null, txp: TxProposalResponse) => {
        if (error) {
          return reject(error)
        }

        resolve(txp)
      })
    })
  }

  public signTxProposal (proposal: TxProposalResponse, passphrase: string): Promise<TxProposalResponse> {
    return new Promise((resolve, reject) => {
      this.vwc.signTxProposal(proposal, passphrase, (error: Error|null, txp: TxProposalResponse) => {
        if (error) {
          return reject(error)
        }

        resolve(txp)
      })
    })
  }

  public broadcastTxProposal (proposal: TxProposalResponse): Promise<TxProposalResponse> {
    return new Promise((resolve, reject) => {
      this.vwc.broadcastTxProposal(proposal, (error: Error|null, txp: TxProposalResponse) => {
        if (error) {
          return reject(error)
        }

        resolve(txp)
      })
    })
  }
}
