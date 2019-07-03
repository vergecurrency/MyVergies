<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation" style="-webkit-app-region: drag">
    <div class="navbar-brand">
      <a class="navbar-item" style="width: 80px;">

      </a>
      <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
      </a>

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item">
          Dashboard
        </a>

        <a class="navbar-item is-active">
          Wallets
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light">
              Settings
            </a>
            <a class="button is-danger">
              <strong>Lock wallet</strong>
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

<style scoped>

</style>
