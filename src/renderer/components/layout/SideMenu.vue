<template>
  <div class="side-menu">
    <aside class="menu">
      <ul class="menu-list menu-list-wallet">
        <li>
          <a class="is-size-2 has-text-weight-semibold is-active">
            Wallets
          </a>
          <ul class="menu-wallets">
            <li v-for="wallet in wallets">
              <a :class="{ 'is-active': wallet === selectedWallet, 'menu-wallets-card': true }">
                <wallet-menu-card :wallet="wallet"></wallet-menu-card>
              </a>
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
  import WalletMenuCard from '../WalletMenuCard'

  let colors = ['green', 'purple', 'orange', 'red']

  export default {
    name: 'side-menu',
    components: {WalletMenuCard},
    data () {
      return {
        selectedWallet: null,
        wallets: [
          {
            name: 'Main Account',
            amount: '1.434.534,53 XVG',
            color: 'blue'
          },
          {
            name: 'Business Account',
            amount: '546.455,62 XVG',
            color: colors[Math.floor(Math.random() * colors.length)]
          }
        ]
      }
    },
    mounted () {
      this.selectedWallet = this.wallets[0]
    }
  }
</script>

<style scoped lang="scss">
  .side-menu {
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
</style>
