<template>
  <div>
    <header-layout :pages="pages" />

    <section class="main-content">
      <div class="notification is-warning is-marginless is-radiusless">
        <strong>MyVergies</strong> is currently still in <strong>BETA</strong> development. This means some features may not work 100%.
      </div>
      <slot>
        <nuxt />
      </slot>
    </section>

    <footer-layout />
  </div>
</template>

<script>
import FooterLayout from '@/docs/layouts/footerLayout'
import HeaderLayout from '@/docs/layouts/headerLayout'

export default {
  components: { FooterLayout, HeaderLayout },

  data () {
    return {
      pages: [
        {
          name: 'Overview',
          path: '/',
          enabled: true,
          exact: true
        },
        {
          name: 'Documentation',
          path: '/documentation',
          enabled: true
        },
        {
          name: 'Release Notes',
          path: '/release-notes',
          enabled: false
        }
      ]
    }
  }
}
</script>

<style>
html,
body,
#__nuxt,
#__layout,
#__nuxt > #__layout > div {
  height: 100%;
}

#__nuxt > #__layout > div {
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
