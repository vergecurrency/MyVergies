<template>
  <nav
    class="navbar is-white is-draggable"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-brand">
          <div class="navbar-item navbar-window-controls"></div>
          <div class="navbar-item has-text-grey-dark">
            <span class="icon">
              <fa-icon icon="wallet" />
            </span>
            <span class="is-size-5">
              <strong>My</strong>Vergies
            </span>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-white is-not-draggable">
              <img src="~@/assets/icons/tor-connected.svg"/>
            </a>
            <a class="button is-white is-not-draggable">
              <span class="icon has-text-grey-dark">
                <FaIcon icon="lock" />
              </span>
            </a>
            <a class="button is-white is-not-draggable">
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
  .is-draggable {
    -webkit-app-region: drag;
  }

  .is-not-draggable {
    -webkit-app-region: no-drag;
  }

  .navbar-window-controls {
    width: 75px;
  }
</style>
