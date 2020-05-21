// @ts-ignore
import Client from 'bitcore-wallet-client-xvg'
import Info from '@/walletManager/models/Info'
import Balance from '@/walletManager/models/Balance'

export default class Wallet {
  protected vwc: Client
  public name?: string
  public color?: string
  public info?: Info

  constructor (name: string, color: string, vwc: Client) {
    this.name = name
    this.color = color
    this.vwc = vwc
  }

  public create (name: string, copayerName: string, m: number = 1, n: number = 1, options: object = {}): Promise<string|null> {
    return new Promise((resolve, reject) => {
      this.vwc.createWallet(name, copayerName, m, n, options, (error: Error|null, secret: string|null) => {
        if (error) {
          return reject(error)
        }

        resolve(secret)
      })
    })
  }

  public open (): Promise<Info> {
    return new Promise((resolve, reject) => {
      this.vwc.openWallet((error: Error, info: Info) => {
        if (error) {
          return reject(error)
        }

        this.info = info

        resolve(this.info)
      })
    })
  }

  public status (): Promise<Info> {
    return new Promise((resolve, reject) => {
      this.vwc.getStatus({ includeExtendedInfo: true }, (error: Error, info: Info) => {
        if (error) {
          return reject(error)
        }

        console.log(info)

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

  public sync (name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
}
