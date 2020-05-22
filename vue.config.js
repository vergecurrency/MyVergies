module.exports = {
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess: config => {
        config.module
          .rule('node-loader')
          .test(/\.node$/)
          .use('node')
          .loader('node-loader')
        config.resolve.alias.set(
          'keytar',
          'keytar/build/Release/keytar.node'
        )
        return config
      },
      builderOptions: {
        productName: 'MyVergies',
        appId: 'com.github.vergecurrency.myvergies',
        publish: [
          {
            provider: 'github',
            owner: 'vergecurrency',
            repo: 'MyVergies'
          }
        ],
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
          icon: 'dist_electron/icons/icon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'x64',
                'ia32'
              ]
            }
          ]
        },
        linux: {
          icon: 'dist_electron/icons'
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          /* eslint-disable */
          artifactName: '${productName}-Setup-${version}.${ext}'
          /* eslint-enable */
        },
        afterSign: 'dist_electron/notarize.js'
      }
    }
  }
}
