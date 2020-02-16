<template>
  <div class="has-text-centered">
    <div class="columns is-centered">
      <div class="column is-narrow">
        <section class="section has-text-left">
          <sending-step :label="$i18n.t('send.signing')" :in-progress="step === 0" :done="step >= 1"/>
          <sending-step :label="$i18n.t('send.publishing')" :in-progress="step === 1" :done="step >= 2"/>
          <sending-step :label="$i18n.t('send.broadcasting')" :in-progress="step === 2" :done="step >= 3"/>
        </section>
        <b-progress type="is-success" :value="step / 3 * 100" size="is-large"/>
        <br/>
      </div>
    </div>
  </div>
</template>

<script>
import SendingStep from '@/components/Sending/SendingStep'

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
      this.step = 0
      let interval = setInterval(() => {
        if (this.step === 3) {
          this.$emit('sent')
          clearInterval(interval)
        }

        ++this.step
      }, 2500)
    }
  }
}
</script>
