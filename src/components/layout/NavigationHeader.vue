<template>
  <div class="box">
    <div class="columns">
      <div v-if="back" class="column is-narrow">
        <router-link
          class="button"
          :to="back"
        >
          <b-icon icon="angle-left" size="is-small"/>
        </router-link>
      </div>
      <div class="column">
        <p class="is-size-4 has-text-weight-bold" v-html="title"/>
      </div>
      <div class="column is-narrow">
        <slot name="right"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navigation-header',
  props: {
    back: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
