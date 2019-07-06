<template>
  <footer>
    <div class="container is-fluid">
      <div class="columns is-centered has-text-grey-light">
        <div class="column has-text-success">
          Tor connected
        </div>
        <div class="column has-text-right">
          <a v-on:click="openURL('https://vergecurrency.com/donate/')">Donate</a>
          ·
          <a v-on:click="openURL('https://github.com/vergecurrency')">GitHub</a>
          ·
          Verge Electron v1.0.0
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
  const { shell } = require('electron')
  export default {
    name: 'AppFooter',
    methods: {
      openURL: (url) => shell.openExternal(url)
    }
  }
</script>
