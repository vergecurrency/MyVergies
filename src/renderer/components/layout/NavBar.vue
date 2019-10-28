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
            <span class="icon">
              <fa-icon icon="wallet" />
            </span>
            <span>
              <strong>V</strong>allet
            </span>
          </a>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-white">
              <img src="~@/assets/icons/tor-connected.svg"/>
            </a>
            <a class="button is-white">
              <span class="icon has-text-grey-dark">
                <FaIcon icon="lock" />
              </span>
            </a>
            <a class="button is-white">
              <span class="icon has-text-grey-dark">
                <FaIcon icon="cog" />
              </span>
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

<style scoped lang="scss">
  .navbar-window-controls {
    width: 75px;
  }

  .hoooo > path {
    fill: green;
  }
</style>
