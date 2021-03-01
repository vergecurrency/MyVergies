<template>
  <div style="overflow-x: hidden; overflow-y: visible">
    <div class="notification is-warning is-marginless is-radiusless">
      <strong>MyVergies</strong> is currently still in <strong>BETA</strong> development. This means some features may not work 100%.
    </div>

    <div class="is-grid has-background-gradient-purple">
      <div class="overlay diagonal-overlay"/>
      <div class="overlay has-background-white is-hidden-tablet is-hidden-desktop is-hidden-fullhd is-hidden-widescreen"/>
      <section class="section overlay">
        <div>
          <div class="columns is-flex is-vcentered">
            <div class="column is-full-mobile is-two-fifths-tablet is-half-desktop is-half-fullhd has-text-centered">
              <div class="header-logo">
                <img src="@/assets/headers/logo@2x.png"/>
              </div>
              <h1 class="is-size-1 is-family-handwritten">
                {{ package.name }}
              </h1>
              <h2 class="subtitle">
                {{ package.description }}
              </h2>
              <a class="button is-success" :href="downloadLink">
                <b-icon icon="download"/>
                <span>Download ({{ os }})</span>
              </a>
              <a class="button is-dark" :href="package.repository.url">
                <b-icon icon="github"/>
                <span>GitHub</span>
              </a>
            </div>
            <div class="column is-hidden-mobile is-four-fifths-tablet is-two-thirds-desktop is-half-fullhd">
              <img v-if="isDarkMode" src="@/assets/app-screenshot-dark.png" class="app-screenshot-overflow"/>
              <img v-else src="@/assets/app-screenshot-light.png" class="app-screenshot-overflow"/>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section class="section has-background-light">
      <div class="container">
        <h2 class="title is-2">Features</h2>
        <div class="columns is-multiline">
          <div
            class="column is-full-mobile is-half-tablet is-one-third-desktop"
            v-for="feature in features"
            :key="feature.title"
          >
            <div class="card">
              <div class="card-content">
                <div class="columns">
                  <div class="column is-narrow">
                    <b-icon :icon="feature.icon" type="is-success" />
                  </div>
                  <div class="column">
                    <p class="title is-5">{{ feature.title }}</p>
                    {{ feature.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Features from '@/docs/lists/features.ts'

const pkg = require('@/../package')

export default {
  name: 'index',

  data () {
    return {
      package: pkg,
      os: null,
      features: Features,
      isDarkMode: false
    }
  },

  created () {
    if (navigator.appVersion.indexOf('Win') !== -1) this.os = 'Windows'
    if (navigator.appVersion.indexOf('Mac') !== -1) this.os = 'macOS'
    if (navigator.appVersion.indexOf('X11') !== -1) this.os = 'UNIX'
    if (navigator.appVersion.indexOf('Linux') !== -1) this.os = 'Linux'

    // Set dark mode or not and listen for changes.
    this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.isDarkMode = e.matches
    })
  },

  computed: {
    downloadLink () {
      const version = this.package.version
      const baseUrl = `${this.package.repository.url.replace('.git', '')}/releases/download/v${version}`

      switch (this.os) {
        case 'macOS':
          return `${baseUrl}/MyVergies-${this.package.version}.dmg`
        case 'Windows':
          return `${baseUrl}/MyVergies-Setup-${this.package.version}.exe`
        case 'UNIX':
        case 'Linux':
          return `${baseUrl}/MyVergies-${this.package.version}.AppImage`
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.header-logo > img {
  max-width: 200px;
}

.app-screenshot-overflow {
  margin-bottom: -150px;
}

.is-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  width: 100vw;
}

.overlay {
  grid-column:1;
  grid-row:1;
}

.diagonal-overlay {
  background: linear-gradient(250deg, #ffffff00 40%, white 40%);
}

@media (prefers-color-scheme: dark) {
  .diagonal-overlay {
    background: linear-gradient(250deg, rgba(34, 34, 34, 0) 40%, #1c1c1c 40%);
  }
}
</style>
