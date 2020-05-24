'use strict'

import { app, protocol, nativeTheme, BrowserWindow, Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as Tor from '@deadcanaries/granax'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
import { generateMenuTemplate, dockTemplate } from '@/toolbar/menu'
import logger from 'electron-log'
import ElectronWindowState from 'electron-window-state'
import '@/utils/keytar/main'
import { isDevelopmentEnvironment, isProductionEnvironment, isMacOSEnvironment, isWinOSEnvironment } from './utils'

logger.transports.file.level = 'debug'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null
const TOR_SOCKS_PORT = 9999
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(generateMenuTemplate()))

  if (process.platform === 'darwin') {
    app.dock.setMenu(Menu.buildFromTemplate(dockTemplate))
  }

  const mainWindowState = ElectronWindowState({
    defaultWidth: 1100,
    defaultHeight: 663
  })

  // Create the browser window.
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    height: mainWindowState.height,
    width: mainWindowState.width,
    title: 'MyVergies',
    minHeight: 560,
    minWidth: 1030,
    show: true,
    useContentSize: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1b1c1f' : '#e0e0e0',
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: 12,
      y: 36
    },
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindowState.manage(win)

  win.webContents.session.setProxy({
    proxyRules: `socks5://127.0.0.1:${TOR_SOCKS_PORT}`,
    proxyBypassRules: '<local>, 192.168.1.1/16, fefe:13::abc/33'
  }).then(() => {
    console.log('Socks proxy set')

    if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
      win!.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
      if (!process.env.IS_TEST) win!.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      win!.loadURL('app://./index.html')
    }
  })

  if (isMacOSEnvironment()) {
    let forceQuit = false

    app.on('before-quit', () => {
      forceQuit = true
    })

    win.on('close', event => {
      if (!forceQuit) {
        event.preventDefault()

        win!.hide()
      }
    })
  }

  win.on('closed', () => {
    win = null
  })

  win.once('ready-to-show', () => {
    win!.show()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  } else {
    win.show()
  }
})

const startUpTorOnPort = (port: number) => {
  const tor = Tor()
  return new Promise((resolve, reject) => {
    tor.on('ready', async () => {
      tor.setConfig('SocksPort', `${port}`, () => {
        tor.getConfig('SocksPort', (_: any, result: any) => {
          resolve(result)
        })
      })
    })

    tor.on('error', (err: Error) => {
      reject(err)
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  startUpTorOnPort(TOR_SOCKS_PORT).then(async port => {
    console.log(`TorSocks listening on ${port}!`)

    if (isDevelopmentEnvironment() && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
      try {
        await installVueDevtools()
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createWindow()
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopmentEnvironment()) {
  if (isWinOSEnvironment()) {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/**
 * Auto Updater
 */
autoUpdater.logger = logger
autoUpdater.allowPrerelease = true
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

app.on('ready', () => {
  if (isProductionEnvironment()) {
    autoUpdater.checkForUpdatesAndNotify()
  }
})
