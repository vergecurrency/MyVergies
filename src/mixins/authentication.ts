import Vue from 'vue'
import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'
import { BModalConfig } from 'buefy/types/components'
import Log from 'electron-log'

const authenticationModalStatus = {
  shown: false
}

const showAuthenticationModal = (vue: Vue, config: object = {}) => {
  Log.info('authenticate')

  if (authenticationModalStatus.shown) {
    return
  }

  authenticationModalStatus.shown = true

  vue.$buefy.modal.open({
    // @ts-ignore
    component: AuthenticationModal,
    parent: vue,
    hasModalCard: true,
    fullScreen: false,
    canCancel: false,
    events: {
      authenticated () {
        Log.info('authenticated')
      },

      forgotPassword () {
        Log.info('forgot password')
      },
      close () {
        authenticationModalStatus.shown = false
      }
    },
    ...config
  })
}

Vue.mixin({
  computed: {
    authenticationModalStatus () {
      return authenticationModalStatus
    }
  },

  methods: {
    lock (animated: boolean = true) {
      const config: BModalConfig = {
        fullScreen: true
      }

      if (!animated) {
        config.animation = ''
      }

      showAuthenticationModal(this, config)
    },

    authenticate () {
      showAuthenticationModal(this)
    }
  }
})
