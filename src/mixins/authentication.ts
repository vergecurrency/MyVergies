import Vue from 'vue'
import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'
import { BModalConfig } from 'buefy/types/components'
import Log from 'electron-log'
import { NavigationGuardNext, Route } from 'vue-router'

const showAuthenticationModal = (vue: Vue, config: object = {}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (vue.$root.authenticationModalShown) {
      // @ts-ignore
      resolve(vue.$root.authenticated)
    }

    Log.info('authenticate')

    // @ts-ignore
    vue.$root.authenticationModalShown = true

    vue.$buefy.modal.open({
      // @ts-ignore
      component: AuthenticationModal,
      parent: vue,
      canCancel: false,
      hasModalCard: true,
      events: {
        authenticated () {
          Log.info('authenticated')

          // @ts-ignore
          resolve(vue.$root.authenticated = true)
        },

        forgotPassword () {
          Log.info('forgot password')
        },
        close () {
          // @ts-ignore
          vue.$root.authenticationModalShown = false
        }
      },
      ...config
    })
  })
}

Vue.mixin({
  methods: {
    lock () {
      // @ts-ignore
      if (!this.$root.authenticated) {
        return
      }

      Log.info('lock application')

      // @ts-ignore
      this.$root.authenticated = false

      if (this.$route.meta.needsAuthentication || false) {
        // @ts-ignore
        this.authenticate()
      }
    },

    authenticate (): Promise<boolean> {
      return showAuthenticationModal(this)
    },

    registerRouterGuard () {
      this.$router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
        // @ts-ignore
        if (!((to.meta.needsAuthentication || false) && !this.$root.authenticated)) {
          next()

          return
        }

        next(false)

        // @ts-ignore
        this.authenticate().then(() => {
          this.$router.push({
            // @ts-ignore
            name: to.name,
            params: to.params
          })
        })
      })
    }
  }
})
