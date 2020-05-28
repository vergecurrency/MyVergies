import electron from 'electron'

export default {
  setCredentials: async (service: string, account: string, credentials: string) => {
    return electron.ipcRenderer.sendSync('set-password', service, account, credentials)
  },

  getCredentials: async (service: string, account: string) => {
    return electron.ipcRenderer.sendSync('get-password', service, account)
  },

  deleteCredentials: async (service: string, account: string) => {
    return electron.ipcRenderer.sendSync('delete-password', service, account)
  },

  walletService: (): string => {
    return 'MyVergies Wallet'
  }
}
