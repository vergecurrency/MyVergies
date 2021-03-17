<template>
  <div class="main-menu">
    <aside class="menu">
      <ul class="menu-list menu-list-wallet">
        <li>
          <a class="is-size-2 has-text-weight-semibold is-not-clickable" v-html="$i18n.t('main.menu.wallets')"/>
          <ul class="menu-wallets">
            <li v-if="hasNoWallets">
              <router-link
                :to="{ name: 'wallets.create' }"
                active-class=""
                class="menu-wallets-card"
              >
                <wallet-card-placeholder/>
              </router-link>
            </li>
            <li v-else v-for="wallet in walletPlaceholders" :key="wallet.identifier">
              <a v-if="wallet.isLoading" class="menu-wallets-card"><wallet-card-skeleton/></a>
              <router-link
                v-else
                :to="{ name: 'wallets', params: { walletIdentifier: wallet.identifier, wallet }}"
                class="menu-wallets-card"
                @click="selectedWallet = wallet"
              >
                <wallet-card :wallet="wallet"></wallet-card>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'wallets.create' }">
                <b-icon icon="plus" size="is-small"/>
                <span v-t="'main.menu.add'"/>
              </router-link>
            </li>
          </ul>
        </li>
        <li class="is-hidden">
          <router-link
            class="is-size-4 has-text-weight-semibold"
            :to="{ name: 'blockchain' }"
            v-html="$i18n.t('main.menu.blockchain')"
          />
        </li>
        <li class="is-hidden">
          <router-link
            class="is-size-4 has-text-weight-semibold"
            :to="{ name: 'settings' }"
            v-html="$i18n.t('main.menu.settings')"
          />
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WalletCard from '@/components/WalletCard'
import WalletCardPlaceholder from '@/components/WalletCardPlaceholder'
import WalletCardSkeleton from '@/components/WalletCardSkeleton'

export default {
  name: 'main-menu',
  components: { WalletCardSkeleton, WalletCardPlaceholder, WalletCard },
  props: {
    wallets: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedWallet: null
    }
  },
  computed: {
    ...mapGetters(['allWalletIdentifiers']),

    walletPlaceholders () {
      return this.allWalletIdentifiers.map(identifier => {
        const wallet = this.wallets.find(wallet => wallet.identifier === identifier)

        if (wallet) {
          wallet.isLoading = false
          return wallet
        }

        return {
          identifier,
          isLoading: true
        }
      })
    },

    hasNoWallets () {
      return this.allWalletIdentifiers.length === 0
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

  .main-menu .icon {
    display: -webkit-inline-box;
    height: 1.5em;
    width: 1.5em;
  }

  .main-menu .icon:first-child:not(:last-child) {
    margin-right: 0.1875em;
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
