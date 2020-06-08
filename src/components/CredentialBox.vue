<template>
  <div
    class="box"
  >
    <span
      class="is-large is-family-monospace has-text-weight-semibold"
      v-html="maskedCredential"
    />
    <nav class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <a class="level-item button is-small is-rounded" aria-label="show" @click="visible = !visible">
          <b-icon v-if="visible" icon="eye-slash" size="is-small"/>
          <b-icon v-else icon="eye" size="is-small"/>
        </a>
        <a class="level-item button is-small is-rounded" aria-label="copy" @click="copy">
          <b-icon icon="copy" size="is-small"/>
        </a>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'CredentialBox',
  props: {
    credential: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    maskedCredential () {
      if (this.visible) {
        return this.credential
      }

      return this.credential.split(' ').map(word => {
        if (word.length < 5) {
          return word.replace(/./g, '*')
        }

        const first = word.substring(0, 1)
        const mask = word.substring(1, word.length).replace(/./g, '*')

        return first + mask
      }).join(' ')
    }
  },
  methods: {
    copy () {
      this.$electron.clipboard.writeText(this.credential, 'selection')

      this.$buefy.toast.open({
        message: this.$i18n.t('main.copiedSuccessfully'),
        type: 'is-success'
      })
    }
  }
}
</script>
