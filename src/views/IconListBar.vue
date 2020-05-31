<template>
  <div class="buttons">
    <TorStatus />
    <a class="button is-white is-not-draggable" @click="unlock">
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

import AuthenticationModal from '@/components/modals/AuthenticationModal'

export default {
  name: 'icon-list-bar',
  components: { TorStatus },
  methods: {
    unlock () {
      this.$buefy.modal.open({
        parent: this,
        component: AuthenticationModal,
        hasModalCard: true,
        canCancel: ['escape', 'outside'],
        fullScreen: true
      })
    }
  }
}
</script>

<style scoped>
.dropdown-trigger {
  margin: 0.5rem 0.5rem 0.5rem 0;
}
</style>
