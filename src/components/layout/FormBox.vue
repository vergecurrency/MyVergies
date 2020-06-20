<template>
  <div class="box" :class="boxClasses">
    <div class="columns is-vcentered">
      <div class="column">
        <h4 class="has-text-weight-semibold" v-html="title"/>
        <p v-html="description"/>
      </div>
      <div class="column" :class="contentColumnClasses">
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
      boxClasses: {
        'has-background-info-light': this.type === 'is-info',
        'has-background-success has-text-white': this.type === 'is-success',
        'has-background-warning': this.type === 'is-warning',
        'has-background-danger has-text-white': this.type === 'is-danger'
      },
      contentColumnClasses: {
        'is-narrow': this.isNarrow
      }
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
    }
  }
}
</script>
