module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'MyVergies',
        appId: 'org.verge.my-vergies',
        dmg: {
          sign: false,
          icon: 'dist_electron/icons/dmg.icns',
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        mac: {
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'dist_electron/entitlements.mac.plist',
          entitlementsInherit: 'dist_electron/entitlements.mac.plist',
          icon: 'dist_electron/icons/icon.icns'
        },
        win: {
          icon: 'dist_electron/icons/icon.ico'
        },
        linux: {
          icon: 'dist_electron/icons'
        },
        afterSign: 'dist_electron/notarize.js'
      }
    }
  }
}
