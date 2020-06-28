<p align="center"><img src="https://raw.githubusercontent.com/vergecurrency/MyVergies/master/readme-header.png" alt="MyVergies Logo"></p>

<p align="center">
  <a href="https://github.com/vergecurrency/MyVergies/actions" target="_blank"><img src="https://github.com/vergecurrency/MyVergies/workflows/CICD/badge.svg"></a>
  <img src="https://img.shields.io/badge/status-pre--alpha-red.svg">
  <img src="https://img.shields.io/badge/macOS-^10.14-blue.svg">
  <img src="https://img.shields.io/badge/Windows-^10-lightblue.svg">
  <img src="https://img.shields.io/badge/Ubuntu-^18.04-orange.svg">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg">
</p>

#  MyVergies

This desktop wallet provides an easy and secure wallet on your personal computer. With **Tor** integrated you can be sure your http communication is private. Sending and receiving XVG in a secure and easy to use wallet will actually change the way you use Verge Currency. 💪

## Features:

* Sending and receiving XVG
* Store addresses in an address book
* Tor integrated
* Price statistics in different fiat currencies
* Private keys are yours
* Possibility to choose your own wallet service

## Local Development

If you want to help us out on development you can use this guide:

1. Fork the project, and clone it to your local machine.

2. Install the npm dependencies.
``` bash
npm ci
```

_Note : If you're using Linux, this project needs libsecret as a dependency. You need to install it before running npm:_

Ubuntu/Debian : `sudo apt install libsecret-1-dev`

Red Hat : `sudo yum install libsecret-devel`

Arch Linux : `sudo pacman -S libsecret`

3. Run a local instance with hot reload.
```bash
npm run electron:serve
```

4. Run tests locally.
```bash
npm test
```

Please setup your own local VWS instance to test your changes against. You can checkout [the bitcore repository](https://github.com/vergecurrency/bitcore) and setup an instance [using docker](https://github.com/vergecurrency/bitcore/blob/master/Docker.md).

## Build With

* [Vue.js](https://github.com/vuejs/vue) - Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web
* [Electron](https://github.com/github/electron) - Build cross-platform desktop apps with JavaScript, HTML, and CSS
* [Vue CLI Plugin Electron Builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) - A Vue Cli 3/4 plugin for Electron with no required configuration
* [Tor](https://www.torproject.org) - The intergration of Tor makes sure your transactions are private

### Community

* [Telegram](https://t.me/VERGExvg)
* [Discord](https://discord.gg/vergecurrency)
* [Twitter](https://www.twitter.com/vergecurrency)
* [Facebook](https://www.facebook.com/VERGEcurrency/)
* [Reddit](https://www.reddit.com/r/vergecurrency/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### BEFORE CONTRIBUTING

This repository is in alpha state and so it's not ready for feature pull requests.
