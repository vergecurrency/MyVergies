<template>
  <div id="app" class="app-container is-unselectable">
    <NavBar>
      <template slot="navbar-items">
        <IconListBar/>
      </template>
    </NavBar>
    <div class="app-content-container is-marginless" :class="{'update-notification': hasUpdateNotification}">
      <UpdateNotification v-if="hasUpdateNotification" />
      <div class="columns is-gapless" style="height: 100%">
        <MainMenu class="column is-one-quarter" :wallets="wallets"/>
        <ContentContainer>
          <RouterView class="app-content-box-container"/>
        </ContentContainer>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/layout/NavBar'
import IconListBar from '@/components/layout/IconListBar'
import MainMenu from '@/components/layout/MainMenu'
import ContentContainer from '@/components/layout/ContentContainer'
import UpdateNotification from '@/components/UpdateNotification'
import { ipcRenderer } from 'electron'
import AddPinModal from '@/views/Settings/AddPinModal'

export default {
  name: 'my-vergies',
  components: {
    UpdateNotification,
    ContentContainer,
    MainMenu,
    NavBar,
    IconListBar
  },

  data () {
    return {
      wallets: this.$walletManager.wallets,
      hasUpdateNotification: false
    }
  },

  created () {
    this.$authManager.registerRouterGuard()
    this.$authManager.pinIsSet().then(isSet => {
      if (!isSet) {
        this.$buefy.modal.open({
          component: AddPinModal,
          parent: this,
          canCancel: false,
          hasModalCard: true,
          trapFocus: true
        })
      }
    })

    ipcRenderer.on('open-settings', () => {
      this.$router.push('/settings')
    })

    ipcRenderer.on('lock-application', () => {
      this.$authManager.lock()
    })

    ipcRenderer.on('user-idle', () => {
      this.$authManager.lock()
    })

    ipcRenderer.on('update-available', () => {
      this.hasUpdateNotification = true
    })
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/main';

  .app-container {
    height: 100%;
    background: #fbfbfb;
    cursor: default;
  }

  .app-content-container {
    height: calc(100% - 53px);
  }

  .app-content-container.update-notification {
    height: calc(100% - 101px);
  }

  .app-content-box-container {
    max-width: 1024px;
    margin: auto;
  }

  @media (prefers-color-scheme: dark) {
    .app-container {
      color: white;
      background: #1f2123;
    }
  }
</style>
