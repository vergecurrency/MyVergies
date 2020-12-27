import { autoUpdater, UpdateCheckResult } from 'electron-updater'
import logger from 'electron-log'
import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'

/**
 * Auto Updater
 */
autoUpdater.logger = logger
autoUpdater.allowPrerelease = true
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

ipcMain.on('install-update', async (event: IpcMainEvent) => {
  logger.info('Auto updater: install update')

  app.emit('before-quit')

  autoUpdater.quitAndInstall()
})

export default class AutoUpdater {
  protected browserWindow: BrowserWindow|null

  constructor (browserWindow: BrowserWindow|null) {
    this.browserWindow = browserWindow
  }

  public checkForUpdatesAndNotify (): void {
    if (this.browserWindow === null) {
      return
    }

    logger.info('Auto updater: check for new version')

    autoUpdater.on('update-downloaded', (updateInfo) => {
      this.browserWindow!.webContents.send('update-available', updateInfo.version)
    })

    autoUpdater.checkForUpdatesAndNotify().then((result: UpdateCheckResult|null) => {
      if (result === null) {
        return
      }

      logger.info(`Auto updater: new update found ${result.updateInfo.version}`)
    }).catch(e => {
      logger.error(e)
    })
  }

  public on (event: string | symbol, listener: (...args: any[]) => void): this {
    autoUpdater.on(event, listener)

    return this
  }
}
