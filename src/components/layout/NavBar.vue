<template>
  <nav
    class="navbar is-white is-draggable"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-brand">
          <div v-if="isDarwin" class="navbar-item navbar-window-controls"></div>
          <div class="navbar-item logo"></div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
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
  name: 'NavBar',
  computed: {
    isDarwin () {
      return process.platform === 'darwin'
    }
  }
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
    width: 65px;
  }

  .logo {
    margin-left: 10px;
    background: url("~@/assets/logo.svg");
    background-repeat: no-repeat;
    background-position: center;
    width: 120px;
  }

  @media (prefers-color-scheme: dark) {
    .navbar.is-white {
      background: #2c2e30;
    }

    .logo {
      background-image: url("~@/assets/logo-light.svg");
    }
  }
</style>
