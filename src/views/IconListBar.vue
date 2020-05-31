<template>
  <div class="buttons">
    <a class="button is-white is-not-draggable">
      <StandardOnion />
    </a>
    <a class="button is-white is-not-draggable">
      <DisconnectedOnion />
    </a>
    <a class="button is-white is-not-draggable">
      <ErrorOnion />
    </a>
    <a class="button is-white is-not-draggable">
      <LoadingOnion />
    </a>
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
import StandardOnion from '@/assets/tor-icons/onion-connected'
import ErrorOnion from '@/assets/tor-icons/onion-error'
import DisconnectedOnion from '@/assets/tor-icons/onion-disconnected'
import LoadingOnion from '@/assets/tor-icons/onion-loading'
import AuthenticationModal from '@/components/modals/AuthenticationModal'

export default {
  components: { DisconnectedOnion, StandardOnion, ErrorOnion, LoadingOnion },
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
