import Vue from 'vue'
import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'
import { BModalConfig } from 'buefy/types/components'

const authenticationModalStatus = {
  shown: false
}

const showAuthenticationModal = (vue: Vue, config: object = {}) => {
  console.log('authenticate')

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
        console.log('authenticated')
      },

      forgotPassword () {
        console.log('forgot password')
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
