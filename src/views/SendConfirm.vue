<template>
  <div class="has-text-centered">
    <h1 class="title">Confirm Transaction</h1>

    <div class="columns">
      <div class="column has-text-left">Send</div>
      <div class="column has-text-right has-text-weight-bold">10,00 XVG</div>
    </div>
    <div class="columns">
      <div class="column has-text-left">Transaction fee</div>
      <div class="column has-text-right has-text-weight-bold">0,10 XVG</div>
    </div>

    <div class="navbar-divider"/>

    <div class="columns is-size-4">
      <div class="column has-text-left">Total</div>
      <div class="column has-text-right has-text-weight-bold has-text-primary">10,10 XVG</div>
    </div>
    <div class="columns">
      <div class="column has-text-right has-text-weight-bold has-text-primary">€ 0,05</div>
    </div>

    <div class="navbar-divider"/>

    <div class="columns">
      <div class="column has-text-left">
        Recipient
      </div>
      <div class="column has-text-right has-text-weight-bold">
        <span class="tag is-large is-selectable is-family-monospace" v-html="value.recipient"/>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="notification">
          <small class="has-text-grey">
            Controleer het wallet adres nogmaals. Verge Currency kan niet verantwoordelijk gehouden worden voor het verlies van XVG door foutief gebruikte wallet adressen.
          </small>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <button class="button is-primary" @click="$emit('confirmed')">
          Confirm transaction
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendConfirm',
  props: {
    value: {
      required: true,
      type: Object
    }
  }
}
</script>
