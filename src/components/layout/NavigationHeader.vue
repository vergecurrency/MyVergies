<template>
  <div class="box">
    <div class="columns">
      <div class="column is-narrow">
        <router-link
          class="button"
          :to="back"
        >
          <fa-icon icon="angle-left"/>
        </router-link>
      </div>
      <div class="column">
        <p class="is-size-4 has-text-weight-bold" v-html="title"/>
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
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
