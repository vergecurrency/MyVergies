import keytar from 'keytar'
import electron from 'electron'

electron.ipcMain.on('get-password', async (event, service: string, wallet: string) => {
  event.returnValue = await keytar.getPassword(service, wallet)
})

electron.ipcMain.on('set-password', async (event, service: string, wallet: string, credentials: string) => {
  event.returnValue = await keytar.setPassword(service, wallet, credentials)
})

electron.ipcMain.on('delete-password', async (event, service: string, wallet: string) => {
  event.returnValue = await keytar.deletePassword(service, wallet)
})
