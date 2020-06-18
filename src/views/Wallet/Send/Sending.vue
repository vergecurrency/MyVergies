<template>
  <div class="has-text-centered">

    <div class="block">
      <div class="columns is-centered">
        <div class="column is-narrow">
          <sending-step :label="$i18n.t('send.signing')" :in-progress="step === 0" :done="step >= 1"/>
        </div>
        <div class="column is-narrow">
          <sending-step :label="$i18n.t('send.publishing')" :in-progress="step === 1" :done="step >= 2"/>
        </div>
        <div class="column is-narrow">
          <sending-step :label="$i18n.t('send.broadcasting')" :in-progress="step === 2" :done="step >= 3"/>
        </div>
      </div>
    </div>

    <div class="block" v-html="$i18n.t('send.sendingDescription')"/>

    <div class="columns is-centered">
      <div class="column is-half">
        <b-progress type="is-success" :value="step / 3 * 100" size="is-large"/>
      </div>
    </div>

  </div>
</template>

<script>
import SendingStep from './SendingStep'

export default {
  name: 'Sending',
  components: { SendingStep },
  data () {
    return {
      step: 0
    }
  },
  methods: {
    animate () {
      if (this.step === 2) {
        return
      }

      ++this.step
    }
  }
}
</script>
