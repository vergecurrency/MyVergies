<template>
  <div class="main-menu">
    <aside class="menu">
      <ul class="menu-list menu-list-wallet">
        <li>
          <a class="is-size-2 has-text-weight-semibold is-not-clickable" v-html="$i18n.t('main.menu.wallets')"/>
          <ul class="menu-wallets">
            <li v-if="wallets.length === 0">
              <router-link
                :to="{ name: 'wallets.create' }"
                active-class=""
                class="menu-wallets-card"
              >
                <wallet-card-placeholder/>
              </router-link>
            </li>
            <li v-for="wallet in wallets" :key="wallet.name">
              <router-link
                :to="{ name: 'wallets', params: { walletName: wallet.name, wallet }}"
                class="menu-wallets-card"
                @click="selectedWallet = wallet"
              >
                <wallet-card :wallet="wallet"></wallet-card>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'wallets.create' }" v-t="'main.menu.add'"></router-link>
            </li>
          </ul>
        </li>
        <li>
          <router-link
            class="is-size-4 has-text-weight-semibold"
            :to="{ name: 'explorer' }"
            v-html="$i18n.t('main.menu.explorer')"
          />
        </li>
        <li>
          <router-link
            class="is-size-4 has-text-weight-semibold"
            :to="{ name: 'contacts' }"
            v-html="$i18n.t('main.menu.contacts')"
          />
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import WalletCard from '@/components/WalletCard'
import WalletCardPlaceholder from '@/components/WalletCardPlaceholder'

export default {
  name: 'main-menu',
  components: { WalletCardPlaceholder, WalletCard },
  props: {
    wallets: {
      type: Array
    }
  },
  data () {
    return {
      selectedWallet: null
    }
  },
  mounted () {
    this.selectedWallet = this.wallets[0]
  }
}
</script>

<style scoped lang="scss">
  .main-menu {
    background: #fbfbfb;
    border-right: 1px solid #e8e8e8;
    overflow-y: auto;
    max-width: 280px;
  }

  .menu-list.menu-list-wallet a {
    padding: 10px 30px;
  }

  .menu-list.menu-list-wallet a.is-active,
  .menu-wallets a.menu-wallets-card:hover,
  .menu-list a.is-not-clickable:hover {
    background-color: transparent;
  }

  .menu-list.menu-list-wallet li ul {
    border-left: none;
    margin: 0;
    padding-left: 0;
  }

  .menu-list-wallet a {
    position: relative;
  }

  .menu-list-wallet a.router-link-active::after {
    position: absolute;
    content: "•";
    font-size: 50px;
    line-height: 0;
    color: #252525;
    right: 5px;
    top: calc(50% - 5px);
  }

  @media (prefers-color-scheme: dark) {
    .main-menu {
      background: #1f2123;
      border-right: 1px solid #333333;
      color: white;
    }

    .menu-list a:hover {
      background-color: #1d1d1d;
      color: whitesmoke;
    }

    .menu-list-wallet a.router-link-active::after {
      color: whitesmoke;
    }
  }
</style>
