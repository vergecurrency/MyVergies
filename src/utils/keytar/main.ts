import keytar from 'keytar'
import electron from 'electron'
import Log from 'electron-log'

electron.ipcMain.on('get-password', async (event, service: string, wallet: string) => {
  Log.info(`request password for service "${service}" and wallet "${wallet}"`)

  event.returnValue = await keytar.getPassword(service, wallet)
})

electron.ipcMain.on('set-password', async (event, service: string, wallet: string, credentials: string) => {
  Log.info(`request set password for service "${service}" and wallet "${wallet}"`)

  event.returnValue = await keytar.setPassword(service, wallet, credentials)
})

electron.ipcMain.on('delete-password', async (event, service: string, wallet: string) => {
  Log.info(`request delete password for service "${service}" and wallet "${wallet}"`)

  event.returnValue = await keytar.deletePassword(service, wallet)
})
