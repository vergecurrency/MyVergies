<template>
  <section class="section has-text-centered">
    <h1 class="title has-text-success">{{ $i18n.t('send.transactionSent') }}!</h1>
    <p class="content">{{ $i18n.t('send.transactionSentSubtitle') }}!</p>
    <button class="button is-primary" @click="$emit('done')" v-html="$i18n.t('send.done')"/>
  </section>
</template>

<script>
export default {
  name: 'TransactionSent'
}
</script>
