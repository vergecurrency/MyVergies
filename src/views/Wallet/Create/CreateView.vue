<template>
  <div class="is-vcentered is-fullheight">
    <div class="columns has-text-centered">
      <div class="column">
        <b-icon icon="plus" custom-size="6x"/>
        <h1 class="is-size-1 has-text-grey is-family-handwritten">
          Create a Wallet ✨
        </h1>
        <p>
          Choose wisely! Do you have an existing wallet<br />
          from your iOS or Android device? Restore it here...<br />
          Or do you want to create a new wallet?
        </p>
      </div>
    </div>

    <div class="columns is-centered has-text-centered">
      <div class="column is-narrow">
        <div class="buttons">
          <router-link class="button is-primary" :to="{ name: 'wallets.create.new' }">
            Create a new wallet
          </router-link>
          <router-link class="button is-success" :to="{ name: 'wallets.create.restore' }">
            Restore an existing wallet
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wallet-create-view'
}
</script>
