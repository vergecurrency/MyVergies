<template>
  <div>
    <header-layout :pages="pages" />

    <section class="main-content">
      <nuxt />
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
          name: 'Home',
          path: '/',
          enabled: true
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
