import Vue from 'vue'
import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'

const showAuthenticationModal = (vue: Vue, fullScreen: boolean = false) => {
  vue.$buefy.modal.open({
    // @ts-ignore
    component: AuthenticationModal,
    parent: vue,
    hasModalCard: true,
    fullScreen: fullScreen,
    canCancel: [
      'escape',
      'outside'
    ],
    events: {
      authenticated () {
        console.log('authenticated')
      },

      forgotPassword () {
        console.log('forgot password')
      }
    }
  })
}

Vue.mixin({
  methods: {
    lock () {
      showAuthenticationModal(this, true)
    },

    authenticate () {
      showAuthenticationModal(this, false)
    }
  }
})
