<template>
  <div>

    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('send.confirm')"/>
      <p v-html="$i18n.t('send.confirmDescription')"/>
    </div>

    <div class="columns is-size-7">
      <div class="column has-text-left" v-html="$i18n.t('send.send')"/>
      <div class="column has-text-right has-text-weight-bold">10,00 XVG</div>
    </div>
    <div class="columns is-size-7">
      <div class="column has-text-left" v-html="$i18n.t('send.transactionFee')"/>
      <div class="column has-text-right has-text-weight-bold">0,10 XVG</div>
    </div>

    <div class="navbar-divider"/>

    <div class="columns is-size-5">
      <div class="column has-text-left" v-html="$i18n.t('send.total')"/>
      <div class="column has-text-right has-text-weight-bold has-text-primary">10,10 XVG</div>
    </div>
    <div class="columns">
      <div class="column has-text-right has-text-weight-bold has-text-primary">€ 0,05</div>
    </div>

    <div class="navbar-divider"/>

    <div class="columns">
      <div class="column has-text-left" v-html="$i18n.t('send.recipient')" />
      <div class="column has-text-right has-text-weight-bold">
        <span class="tag is-large is-selectable is-family-monospace" v-html="value.recipient"/>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="notification">
          <small class="has-text-grey" v-html="$i18n.t('send.transactionWarning')"/>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="buttons is-centered">
          <button class="button is-light" @click="$emit('cancel')" v-html="$i18n.t('send.cancel')"/>
          <button class="button is-primary" @click="$emit('confirmed')" v-html="$i18n.t('send.confirmTransaction')"/>
        </div>
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
