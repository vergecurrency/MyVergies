<template>
  <default-layout>
    <div class="columns">
      <div class="column is-one-quarter" style="max-width: 300px">
        <div class="has-background-light p-5">
          <b-menu>
            <b-menu-list label="Get Started">
              <b-menu-item
                icon="account"
                label="Overview"
                tag="nuxt-link"
                to="/documentation/get-started/overview"
              />
              <b-menu-item
                icon="information-outline"
                label="Installation"
                tag="nuxt-link"
                to="/documentation/get-started/installation"
              />
              <b-menu-item label="Keyboard shortcuts"/>
              <b-menu-item label="Settings"/>
            </b-menu-list>
            <b-menu-list icon="wallet" label="Wallets">
              <b-menu-item label="Your first wallet"/>
              <b-menu-item label="Recover wallet"/>
              <b-menu-item label="Import wallet"/>
              <b-menu-item label="Export wallet"/>
            </b-menu-list>
            <b-menu-list icon="cash-multiple" label="Transactions">
              <b-menu-item label="Send a transaction"/>
              <b-menu-item label="Receive a transaction"/>
            </b-menu-list>
            <b-menu-list icon="broom" label="Sweeping">
              <b-menu-item label="Send a transaction"/>
              <b-menu-item label="Receive a transaction"/>
            </b-menu-list>
          </b-menu>
        </div>
      </div>
      <div class="column">
        <section class="section">
          <div class="container">
            <article class="content">
              <nuxt />
            </article>
          </div>
        </section>
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@/docs/layouts/default'

export default {
  name: 'document',

  components: {
    DefaultLayout
  }
}
</script>
