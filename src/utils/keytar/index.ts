import electron from 'electron'
import Log from 'electron-log'

export default class Keytar {
  static readonly appService: string = 'MyVergies'
  static readonly walletService: string = 'MyVergies Wallet'

  static setCredentials (service: string, account: string, credentials: string) {
    Log.info(`set credentials for service "${service}" and account "${account}"`)

    return electron.ipcRenderer.sendSync('set-password', service, account, credentials)
  }

  static getCredentials (service: string, account: string) {
    Log.info(`get credentials for service "${service}" and account "${account}"`)

    return electron.ipcRenderer.sendSync('get-password', service, account)
  }

  static deleteCredentials (service: string, account: string) {
    Log.info(`delete credentials for service "${service}" and account "${account}"`)

    return electron.ipcRenderer.sendSync('delete-password', service, account)
  }
}
