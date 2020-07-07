<template>
  <div
    class="columns"
  >
    <div
      class="column"
      v-for="digit in Array(numberOfDigits).keys()"
      :key="digit"
    >
      <input
        :ref="digit"
        type="password"
        class="input is-large has-text-centered is-narrow"
        maxlength="1"
        :value="pin[digit] || ''"
        @keyup="nextDigit($event, digit)"
        @keyup.delete="removeDigit(digit)"
        @keydown="validDigit"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PinInput',

  data () {
    return {
      pin: ''
    }
  },

  props: {
    numberOfDigits: {
      type: Number,
      default: 4
    }
  },

  watch: {
    pin (value) {
      if (value.length === this.numberOfDigits) {
        this.$emit('submit', value)
      }
    }
  },

  mounted () {
    this.$nextTick().then(() => {
      this.focus()
    })
  },

  methods: {
    focus () {
      const firstInput = this.$refs[0][0]
      firstInput.focus()
    },

    validDigit (event) {
      if (event.code === 'Backspace') {
        return
      }

      if (!(/[0-9]/.test(event.key))) {
        event.preventDefault()
        event.stopPropagation()

        return false
      }

      return true
    },

    removeDigit (index) {
      this.pin = this.pin.slice(0, -1)
      this.$emit('changed')

      if (index === 0) {
        return
      }

      const previousInput = this.$refs[index - 1][0]
      previousInput.focus()
    },

    nextDigit (event, index) {
      if (!this.validDigit(event)) {
        return
      }

      if (event.code === 'Backspace') {
        return
      }

      if (this.pin.length !== index) {
        return
      }

      this.pin = this.pin + event.key
      this.$emit('changed')

      if (this.pin.length === this.numberOfDigits) {
        return
      }

      const nextIndex = index + 1
      const nextInput = this.$refs[nextIndex][0]
      nextInput.focus()
    }
  }
}
</script>
