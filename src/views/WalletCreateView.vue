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
          <button class="button is-primary">Create a new wallet</button>
          <button class="button is-success">Restore an existing wallet</button>
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
