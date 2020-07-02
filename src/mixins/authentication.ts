import Vue, { VueConstructor } from 'vue'
import { NavigationGuardNext, Route } from 'vue-router'
import { BModalConfig } from 'buefy/types/components'
import Log from 'electron-log'
import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'

declare module 'vue/types/vue' {
  interface Vue {
    authenticationModalShown: boolean
    authenticated: boolean
    lock (): void
    authenticate (config?: object): Promise<boolean>
    validateAuthentication (password: string): boolean
  }
}

Vue.mixin({
  methods: {
    lock () {
      if (!this.$root.authenticated) {
        return
      }

      Log.info('lock application')

      this.$root.authenticated = false

      if (this.$route.meta.needsAuthentication || false) {
        this.authenticate({
          canCancel: false
        })
      }
    },

    authenticate (config: object = {}): Promise<boolean> {
      return new Promise((resolve, reject) => {
        if (this.$root.authenticationModalShown) {
          resolve(this.$root.authenticated)
        }

        Log.info('authenticate')

        this.$root.authenticationModalShown = true
        const vue = this
        const closeHandler = () => {
          vue.$root.authenticated = false
          vue.$root.authenticationModalShown = false

          resolve(false)
        }

        const modal = this.$buefy.modal.open({
          component: AuthenticationModal,
          customClass: 'is-modal-auth',
          parent: this,
          hasModalCard: true,
          trapFocus: true,
          canCancel: ['escape', 'outside'],
          onCancel: closeHandler,
          events: {
            authenticate (password: string) {
              vue.$root.authenticated = vue.validateAuthentication(password)
              vue.$root.authenticationModalShown = false
              modal.close()

              Log.info('authenticated')

              resolve(vue.$root.authenticated)
            },
            forgotPassword () {
              Log.info('forgot password')
            },
            close: closeHandler
          },
          ...config
        })
      })
    },

    validateAuthentication (password: string): boolean {
      return true
    },

    registerRouterGuard () {
      this.$root.authenticated = false

      this.$router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
        if (!((to.meta.needsAuthentication || false) && !this.$root.authenticated)) {
          next()

          return
        }

        next(false)

        this.authenticate().then(authenticated => {
          if (!authenticated) {
            return
          }

          this.$router.push({
            name: to.name || 'welcome',
            params: to.params
          })
        })
      })
    },

    toggleAuthentication () {
      this.$root.authenticated ? this.lock() : this.authenticate()
    }
  }
})
