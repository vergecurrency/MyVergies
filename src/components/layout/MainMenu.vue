<template>
  <div class="main-menu">
    <aside class="menu">
      <ul class="menu-list menu-list-wallet">
        <li>
          <a class="is-size-2 has-text-weight-semibold is-active">
            Wallets
          </a>
          <ul class="menu-wallets">
            <li v-for="wallet in wallets" :key="wallet.name">
              <router-link
                :to="{ name: 'wallets', params: { walletName: wallet.name, wallet }}"
                :class="{ 'is-active': wallet === selectedWallet, 'menu-wallets-card': true }"
                @click="selectedWallet = wallet"
              >
                <wallet-card :wallet="wallet"></wallet-card>
              </router-link>
            </li>
            <li><a>Add new wallet</a></li>
          </ul>
        </li>
        <li>
          <a class="is-size-4 has-text-weight-semibold">
            Explorer
          </a>
        </li>
        <li>
          <a class="is-size-4 has-text-weight-semibold">
            Contacts
          </a>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import WalletCard from '@/components/WalletCard'
import Wallets from '@/assets/data/example/wallets'

export default {
  name: 'main-menu',
  components: { WalletCard },
  data () {
    return {
      selectedWallet: null,
      wallets: Wallets
    }
  },
  mounted () {
    this.selectedWallet = this.wallets[0]
  }
}
</script>

<style scoped lang="scss">
  .main-menu {
    background: #e0e0e0;
    overflow-y: auto;
    max-width: 280px;
  }

  .menu-list.menu-list-wallet a {
    padding: 10px 30px;
  }

  .menu-list.menu-list-wallet a.is-active {
    background-color: transparent;
  }

  .menu-list.menu-list-wallet li ul {
    border-left: none;
    margin: 0;
    padding-left: 0;
  }

  .menu-wallets a.menu-wallets-card:hover {
    background-color: transparent;
  }

  @media (prefers-color-scheme: dark) {
    .main-menu {
      background: #151515;
      color: white;
    }
  }
</style>
