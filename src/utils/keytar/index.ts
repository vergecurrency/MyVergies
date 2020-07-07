import electron from 'electron'

export default class Keytar {
  static readonly appService: string = 'MyVergies'
  static readonly walletService: string = 'MyVergies Wallet'

  static setCredentials (service: string, account: string, credentials: string) {
    return electron.ipcRenderer.sendSync('set-password', service, account, credentials)
  }

  static getCredentials (service: string, account: string) {
    return electron.ipcRenderer.sendSync('get-password', service, account)
  }

  static deleteCredentials (service: string, account: string) {
    return electron.ipcRenderer.sendSync('delete-password', service, account)
  }
}
