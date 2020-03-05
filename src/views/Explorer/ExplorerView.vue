<template>
  <div>
    <div class="columns has-text-centered">
      <div class="column">
        <page-title>
          <img src="@/assets/headers/explorer@2x.png"/>
        </page-title>
        <h1 class="is-size-1 has-text-grey is-family-handwritten">
          Let's Explore The Chain! 🕵️‍♀️
        </h1>
        <p>
          Not an opaque chain ;) but a public chain...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/layout/PageTitle'

export default {
  name: 'explorer-view',
  components: { PageTitle }
}
</script>
