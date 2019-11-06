// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

/* eslint-disable import/no-extraneous-dependencies, global-require, arrow-body-style */
// const webpack = require('@cypress/webpack-preprocessor')
const path = require('path')
const pkg = require('../../../package')

const pathToElectron = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'electron'
)

module.exports = (on, config) => {
  config.browsers = [
    {
      name: 'electron-sandbox',
      family: 'electron-app',
      displayName: 'electron-sandbox',
      version: pkg.version,
      path: pathToElectron,
      // show full package version in the browser dropdown
      majorVersion: `v${pkg.version}`,
      info: pkg.description || 'Electron.js app that supports the Cypress launcher'
    }
  ]

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  })
}
