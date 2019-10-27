<template>
  <nav
    class="navbar is-white"
    role="navigation"
    aria-label="main navigation"
    style="-webkit-app-region: drag;"
  >
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-brand">
          <div class="navbar-item navbar-window-controls"></div>
          <a class="navbar-item is-size-5">
            <strong>V</strong>allet
          </a>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button">
              <strong>Tor</strong>
            </a>
            <a class="button">
              <strong>Lock</strong>
            </a>
            <a class="button">
              <strong>Settings</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'NavBar'
  }
</script>

<style lang="scss">
  .navbar-window-controls {
    width: 75px;
  }
</style>
