import { app, ipcMain } from 'electron'

ipcMain.on('get-version', async (event) => {
  event.returnValue = app.getVersion()
})
