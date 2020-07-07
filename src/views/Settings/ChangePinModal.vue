<template>
  <div class="modal-card box">
    <div class="columns">
      <div class="column">
        <p class="is-size-3 is-family-handwritten">Change your PIN</p>
        You're about to change the PIN used as a security mesuare by this application.
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="box-with-pins">
          <form-box
            title="Current PIN"
            :description="stage === 0 ? 'Fill in your current PIN used to unlock this application' : ''"
            :type="currentPinType"
            :is-narrow="false"
          >
            <pin-input
              @submit="validateCurrentPin"
              @changed="wrongCurrentPin = false"
              :class="{'is-hidden': stage !== 0}"
            />
            <b-icon
              v-if="stage !== 0"
              icon="check"
              type="is-success"
              class="is-pulled-right"
            />
          </form-box>

          <form-box
            :disabled="stage < 1"
            title="New PIN"
            :description="stage === 1 ? 'Fill in your current PIN used to unlock this application' : ''"
            :is-narrow="false"
          >
            <pin-input
              @submit="newPinSubmitted"
              :class="{'is-hidden': stage !== 1}"
            />
            <b-icon
              v-if="stage > 1"
              icon="check"
              type="is-success"
              class="is-pulled-right"
            />
          </form-box>

          <form-box
            :disabled="stage < 2"
            title="Confirm new PIN"
            :description="stage === 2 ? 'Fill in your current PIN used to unlock this application' : ''"
            :is-narrow="false"
            :type="newPinNotConfirmedType"
          >
            <pin-input
              @submit="newPinSubmittedConfirmed"
              @changed="newPinNotConfirmed = false"
              :class="{'is-hidden': stage !== 2}"
            />
            <b-icon
              v-if="stage > 2"
              icon="check"
              type="is-success"
              class="is-pulled-right"
            />
          </form-box>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <b-button @click="$emit('close')">Cancel</b-button>
      </div>
      <div v-if="pin != ''" class="column is-narrow">
        <b-button type="is-primary" @click="change">Change PIN</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import PinInput from '@/components/PinInput'
import FormBox from '@/components/layout/FormBox'

export default {
  name: 'ChangePinModal',
  components: { FormBox, PinInput },
  data () {
    return {
      stage: 0,
      wrongCurrentPin: false,
      newPinNotConfirmed: false,
      pin: ''
    }
  },

  computed: {
    currentPinType () {
      return this.wrongCurrentPin ? 'is-danger' : ''
    },

    newPinNotConfirmedType () {
      return this.newPinNotConfirmed ? 'is-danger' : ''
    }
  },

  methods: {
    change () {
      this.$authManager.changePin(this.pin).then(changed => {
        if (!changed) {
          this.$buefy.toast.open({
            message: 'Couldn\'t change PIN',
            type: 'is-danger'
          })

          return
        }

        this.$emit('close')

        this.$buefy.toast.open({
          message: 'PIN changed!',
          type: 'is-success'
        })
      })
    },

    validateCurrentPin (currentPin) {
      this.$authManager.validateAuthentication(currentPin).then(authenticated => {
        if (!authenticated) {
          this.wrongCurrentPin = true
        } else {
          this.stage = 1
        }
      })
    },

    newPinSubmitted (newPin) {
      this.pin = newPin
      this.stage = 2
    },

    newPinSubmittedConfirmed (confirmedPin) {
      if (this.pin === confirmedPin) {
        this.stage = 3

        return
      }

      this.newPinNotConfirmed = true
    }
  }
}
</script>

<style scoped>
  .box-with-pins > .box:not(:last-child) {
    margin-bottom: 0;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .box-with-pins > .box:not(:first-child) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
