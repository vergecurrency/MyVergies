import keytar from 'keytar'
import electron from 'electron'

electron.ipcMain.on('get-password', (event, service: string, wallet: string) => {
  event.returnValue = keytar.getPassword(service, wallet)
})

electron.ipcMain.on('set-password', (event, service: string, wallet: string, credentials: string) => {
  event.returnValue = keytar.setPassword(service, wallet, credentials)
})

electron.ipcMain.on('delete-password', (event, service: string, wallet: string) => {
  event.returnValue = keytar.deletePassword(service, wallet)
})
