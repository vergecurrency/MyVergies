<template>
  <div class="field">
    <div
      class="button has-text-grey-lighter requirement-marker"
      :class="{'has-text-weight-semibold': checked}"
    >
      <b-icon v-if="checked" icon="check-circle" type="is-success"/>
      <b-icon v-else icon="circle" type="is-light"/>
      <span
        :class="{'has-text-success': checked}"
        v-html="label"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequirementMarker',
  props: {
    label: {
      type: String,
      required: true
    },
    checked: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .requirement-marker {
    background-color: transparent;
    border: none;
  }
</style>
