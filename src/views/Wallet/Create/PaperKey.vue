<template>
  <div>
    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('createWallet.aWalletName')"/>
      <p v-html="$i18n.t('createWallet.aWalletNameDescription')"/>
    </div>

    <div class="columns is-multiline">
      <div
        class="column is-one-third"
        v-for="(word, i) in paperKey"
        :key="i"
      >
        <div class="tags are-medium has-addons">
          <span class="tag is-success">{{ i+1 }}</span>
          <span class="tag is-dark is-family-code has-text-weight-semibold expand-word" v-html="word"/>
        </div>
      </div>
    </div>

    <b-field align="right">
      <b-button
        icon-left="edit"
        :label="$i18n.t('createWallet.writeDownPaperKey')"
        type="is-primary"
        @click="$emit('next')"
      />
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'PaperKey',
  data () {
    return {
      paperKey: [
        'Flee',
        'Cave',
        'Use',
        'Suffer',
        'Cat',
        'Radio',
        'Heart',
        'Same',
        'Frog',
        'Disease',
        'Topple',
        'Inspire'
      ]
    }
  }
}
</script>

<style>
.expand-word {
  flex-grow: 1;
}
</style>
