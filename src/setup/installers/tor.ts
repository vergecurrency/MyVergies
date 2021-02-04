import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import * as ElectronUtils from 'electron-util'
import Log from 'electron-log'
import { InstallerInterface } from '@/setup/installer'

const ASAR_TOR_PATH: string = ElectronUtils.fixPathForAsarUnpack(path.join(__dirname, 'bin', 'Tor'))
const BIN_PATH: string = path.join(app.getPath('appData'), 'MyVergies', 'bin')
const TOR_PATH: string = path.join(BIN_PATH, 'Tor')

const folders = [
  BIN_PATH,
  TOR_PATH,
  path.join(TOR_PATH, 'libstdc++'),
  path.join(TOR_PATH, 'PluggableTransports')
]

const torFiles = [
  path.join('libstdc++', 'libstdc++.so.6'),
  path.join('PluggableTransports', 'obfs4proxy'),
  path.join('PluggableTransports', 'obfs4proxy.exe'),
  'libcrypto-1_1.dll',
  'libcrypto.so.1.1',
  'libevent-2-1-6.dll',
  'libevent-2.1.6.dylib',
  'libevent-2.1.so.6',
  'libevent_core-2-1-6.dll',
  'libevent_extra-2-1-6.dll',
  'libgcc_s_sjlj-1.dll',
  'libssl-1_1.dll',
  'libssl.so.1.1',
  'libssp-0.dll',
  'libwinpthread-1.dll',
  'tor',
  'tor.exe',
  'tor.real',
  'zlib1.dll'
]

class TorInstaller implements InstallerInterface {
  public install (): boolean {
    // Create application Tor directory if it doesn't exist
    // Copy over the tor binary files from the asar folder.
    folders.forEach(folder => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)

        Log.info(`Tor installation: folder created: ${folder}`)
      }
    })

    torFiles.forEach(file => {
      if (!fs.existsSync(path.join(TOR_PATH, file))) {
        fs.copyFileSync(path.join(ASAR_TOR_PATH, file), path.join(TOR_PATH, file))

        Log.info(`Tor installation: file copied: ${file}`)
      }
    })

    if (!ElectronUtils.is.windows) {
      [
        'libcrypto.so.1.1',
        'libevent-2.1.6.dylib',
        'libevent-2.1.so.6',
        'libssl.so.1.1',
        'tor',
        'tor.real'
      ].forEach(file => fs.chmodSync(path.join(TOR_PATH, file), 0o555))

      Log.info('Tor installation: bin files chmodded')
    }

    Log.info('Tor successfully installed!')

    return true
  }
}

export default new TorInstaller()
