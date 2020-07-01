<template>
  <div class="buttons">
    <TorStatus />
    <a class="button is-white is-not-draggable" @click="lock">
      <span class="icon has-text-grey-dark">
        <b-icon size="is-small" icon="lock-open" />
      </span>
    </a>
    <router-link to="/settings" class="button is-white is-not-draggable">
      <span class="icon has-text-grey-dark">
        <b-icon size="is-small" icon="cog" />
      </span>
    </router-link>
    <router-link to="/help" class="button is-white is-not-draggable">
      <span class="icon has-text-grey-dark">
        <b-icon size="is-small" icon="question-circle" />
      </span>
    </router-link>
  </div>
</template>

<script>
import TorStatus from '@/views/TorStatus'

export default {
  name: 'icon-list-bar',
  components: { TorStatus }
}
</script>

<style scoped>
.dropdown-trigger {
  margin: 0 0.5rem 0 0;
}
</style>
