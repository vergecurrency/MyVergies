<template>
  <div>
    <slot name="header">
      <navigation-header v-if="title" :title="title" :back="back"/>
    </slot>

    <slot name="flash"/>

    <slot name="content-box">
      <div class="box">

        <slot name="box-header"/>

        <slot name="section">
          <section class="section">
            <slot/>
          </section>
        </slot>

        <slot name="box-footer"/>

      </div>
    </slot>

    <slot name="footer"/>
  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'

export default {
  name: 'ContentView',
  components: { NavigationHeader },
  props: {
    title: {
      type: String,
      default: null
    },
    back: {
      type: Object,
      default: null
    }
  }
}
</script>
