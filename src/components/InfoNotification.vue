<template>
  <div>
    <div class="tags has-addons is-pulled-right">
      <a
        class="tag is-info"
        @click="isActive = !isActive"
      >
        <b-icon icon="info" size="is-small"/>
      </a>
      <a
        class="tag"
        @click="isActive = !isActive"
      >
        Learn more
      </a>
    </div>

    <b-notification
      has-icon
      type="is-info"
      :active.sync="isActive"
      aria-close-label="Close notification"
    >
      <h3 class="title is-4">
        <slot name="title"/>
      </h3>
      <h4 class="subtitle is-6">
        <slot name="subtitle"/>
      </h4>
      <p class="content is-small">
        <slot name="content"/>
      </p>
    </b-notification>
  </div>
</template>

<script>
export default {
  name: 'InfoNotification',
  data () {
    return {
      isActive: false
    }
  }
}
</script>

<style scoped>

</style>
