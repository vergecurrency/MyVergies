<template>
  <div>

    <div class="is-grid has-background-gradient-purple">
      <div class="overlay diagonal-overlay"/>
      <section class="section overlay">
        <div class="columns is-flex is-vcentered">
          <div class="column is-half has-text-centered">
            <div class="header-logo">
              <img src="@/assets/headers/logo@2x.png"/>
            </div>
            <h1 class="is-size-1 is-family-handwritten">
              {{ package.name }}
            </h1>
            <h2 class="subtitle">
              {{ package.description }}
            </h2>
            <button class="button is-success">
              <b-icon icon="download"/>
              <span>Download (macOS)</span>
            </button>
            <button class="button is-dark">
              <b-icon icon="github"/>
              <span>GitHub</span>
            </button>
          </div>
          <div class="column is-half">
            <img src="@/assets/app-screenshot-s.png" class="image-overhang"/>
          </div>
        </div>
      </section>
    </div>
    <section class="section has-background-light">
      Hello World
    </section>
  </div>
</template>

<script>
const pkg = require('@/../package')

export default {
  name: 'index',

  data () {
    return {
      package: pkg
    }
  }
}
</script>

<style scoped>
.header-logo > img {
  width: 200px;
}

.image-overhang {
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
