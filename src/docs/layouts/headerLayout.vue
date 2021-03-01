<template>
  <b-navbar type="is-light">
    <template slot="brand">
      <b-navbar-item :to="{ path: '/' }" tag="nuxt-link">
        <img src="@/assets/logo.svg" :alt="package.name" class="logo" />
      </b-navbar-item>
    </template>
    <template slot="start">
      <template v-for="page in pages">
        <b-navbar-item
          v-if="page.enabled"
          :key="page.name"
          :to="page.path"
          :active="$route.path === page.path"
          tag="nuxt-link"
        >
          {{ page.name }}
        </b-navbar-item>
      </template>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            tag="a"
            type="is-white"
            class="has-text-grey-dark"
            icon-left="gift"
            label="Sponsor"
            :href="package.funding.find(item => item.type === 'github').url"
          />
          <a class="button is-white" :href="package.repository.url">
            <span class="icon has-text-grey-dark">
              <b-icon icon="github" />
            </span>
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
const pkg = require('@/../package')

export default {
  name: 'HeaderLayout',

  data () {
    return {
      package: pkg
    }
  },

  props: {
    pages: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
.logo {
  width: 120px;
}

@media screen and (min-width: 1024px) {
  .navbar.is-spaced {
    min-height: 5.25rem;
  }
}
</style>
