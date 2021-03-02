<template>
  <div>
    <nuxt-content :document="document" />
  </div>
</template>

<script>
export default {
  name: 'documentation',
  layout: 'document',

  async asyncData ({ $content, params }) {
    const document = await $content('/get-started/overview').fetch()

    return {
      document: document
    }
  }
}
</script>
