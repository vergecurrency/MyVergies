<template>
  <div class="field">
    <div
      class="button has-text-grey-lighter is-medium sending-step"
      :class="{'has-text-weight-semibold': inProgress || done}"
    >
      <b-icon v-if="done" icon="check-circle" type="is-success"/>
      <b-icon v-else-if="inProgress" icon="circle-notch" type="is-primary" class="fa-pulse"/>
      <b-icon v-else icon="circle" type="is-light"/>
      <span
        :class="{'has-text-primary': inProgress, 'has-text-success': done}"
        v-html="label"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendingStep',
  props: {
    label: {
      type: String,
      required: true
    },
    inProgress: {
      type: Boolean,
      default: false
    },
    done: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .sending-step {
    background-color: transparent;
    border: none;
  }
</style>
