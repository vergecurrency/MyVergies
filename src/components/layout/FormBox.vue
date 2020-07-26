<template>
  <div class="box" :class="formattedType">
    <b-switch v-if="toggleable" v-model="enabled" class="form-box-toggle"/>
    <div class="columns is-vcentered">
      <div class="column">
        <h4 class="has-text-weight-semibold" v-html="title"/>
        <p v-if="enabled" v-html="description"/>
      </div>
      <div v-if="enabled" class="column" :class="contentColumnClasses">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormBox',

  data () {
    return {
      enabled: this.isEnabled
    }
  },

  computed: {
    formattedType () {
      switch (this.type) {
        case 'is-info':
          return 'has-background-info-light'
        case 'is-success':
          return 'has-background-success has-text-white'
        case 'is-warning':
          return 'has-background-warning'
        case 'is-danger':
          return 'has-background-danger has-text-white'
        default:
          return ''
      }
    },

    contentColumnClasses () {
      return {
        'is-narrow': this.isNarrow
      }
    }
  },

  watch: {
    isEnabled (enabled) {
      this.enabled = enabled
    }
  },

  props: {
    type: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isNarrow: {
      type: Boolean,
      default: true
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    toggleable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .box[disabled] {
    pointer-events: none;
    opacity: 0.8;
    background: #f1f1f1;
  }

  .form-box-toggle {
    position: absolute;
    right: 26px;
  }
</style>
