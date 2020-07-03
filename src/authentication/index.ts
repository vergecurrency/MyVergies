import Vue, { PluginFunction } from 'vue'
import VueRouter, { NavigationGuardNext, Route } from 'vue-router'
import { BuefyNamespace } from 'buefy'
import Log from 'electron-log'
import AuthenticationModal from '@/components/modals/AuthenticationModal.vue'

class AuthManager {
  protected authenticated: boolean = false
  protected authenticationModalShown: boolean = false
  public $parent!: Vue
  public $router!: VueRouter
  public $buefy!: BuefyNamespace

  public get isAuthenticated (): boolean {
    return this.authenticated
  }

  public injectVue (vue: Vue) {
    this.$parent = vue
    this.$router = vue.$router
    this.$buefy = vue.$buefy
  }

  public lock () {
    if (!this.authenticated) {
      return
    }

    Log.info('lock application')

    this.authenticated = false

    if (this.$router.currentRoute.meta.needsAuthentication || false) {
      this.authenticate({
        canCancel: false
      })
    }
  }

  public authenticate (config: object = {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.authenticationModalShown) {
        resolve(this.authenticated)
      }

      Log.info('authenticate')

      this.authenticationModalShown = true
      const manager = this
      const closeHandler = () => {
        manager.authenticated = false
        manager.authenticationModalShown = false

        resolve(false)
      }

      const modal = this.$buefy.modal.open({
        // @ts-ignore
        component: AuthenticationModal,
        customClass: 'is-modal-auth',
        parent: this.$parent,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape', 'outside'],
        onCancel: closeHandler,
        events: {
          authenticate (password: string) {
            manager.authenticated = manager.validateAuthentication(password)
            manager.authenticationModalShown = false
            modal.close()

            Log.info('authenticated')

            resolve(manager.authenticated)
          },
          forgotPassword () {
            Log.info('forgot password')
          },
          close: closeHandler
        },
        ...config
      })
    })
  }

  public validateAuthentication (password: string): boolean {
    return true
  }

  public registerRouterGuard () {
    this.authenticated = false

    this.$router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
      if (!((to.meta.needsAuthentication || false) && !this.authenticated)) {
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
  }

  public toggleAuthentication () {
    this.authenticated ? this.lock() : this.authenticate()
  }
}

const authManagerPlugin: PluginFunction<any> = function (vue: typeof Vue, options: any): void {
  vue.prototype.$authManager = new AuthManager()
  vue.observable(vue.prototype.$authManager)

  vue.mixin({
    beforeCreate () {
      vue.prototype.$authManager.injectVue(this)
    },

    computed: {
      isAuthenticated (): boolean {
        return vue.prototype.$authManager.isAuthenticated
      }
    }
  })
}

export default authManagerPlugin
