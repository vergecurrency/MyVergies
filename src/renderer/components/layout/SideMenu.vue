<template>
  <div style="max-width: 180px;">
    <div class="has-text-centered">
      <img src="~@/assets/logo.svg" style="height: 40px;"/>
    </div>
    <aside class="menu">
      <ul class="menu-list">
        <li><a>Dashboard</a></li>
        <li><a class="is-active">Wallets</a></li>
        <li><a>Settings</a></li>
      </ul>
    </aside>
  </div>
</template>

<script>
  export default {
    name: 'side-menu'
  }
</script>
