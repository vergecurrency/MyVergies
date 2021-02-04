export interface InstallerInterface {
  install: () => void
}

const installersFiles = require.context('./installers', false, /\.ts$/)
const installers: InstallerInterface[] = []

installersFiles.keys().forEach(key => {
  installers.push(installersFiles(key).default)
})

export default {
  install () {
    installers.forEach(installer => {
      const succeeded = installer.install()

      // Handle failed...
    })
  }
}
