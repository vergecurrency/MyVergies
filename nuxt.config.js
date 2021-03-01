import { resolve } from 'path'

const pkg = require('./package')

module.exports = {
  ssr: false,
  target: 'static',
  srcDir: 'src/docs/',

  generate: {
    dir: 'docs',
    subFolders: false
  },

  alias: {
    '~': resolve(__dirname, './src'),
    '@': resolve(__dirname, './src'),
    assets: resolve(__dirname, './src/assets')
  },

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    './src/assets/scss/main.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy'
  ],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {}
  }
}
