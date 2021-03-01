<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>{{ package.name }}</strong> by
        <a :href="package.author.url">{{ package.author.name }}</a>.
        <br>
        Code available on
        <a :href="package.bugs.url">GitHub</a>.
      </p>
    </div>
  </footer>
</template>

<script>
const pkg = require('@/../package')

export default {
  name: 'FooterLayout',

  data () {
    return {
      package: pkg
    }
  }
}
</script>

<style scoped></style>
