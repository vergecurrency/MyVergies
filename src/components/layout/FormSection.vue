<template>
 <div>
   <div v-if="!noDivider" class="navbar-divider"/>
   <h6 class="title is-6 has-text-grey-light" v-html="title"/>
   <slot/>
 </div>
</template>

<script>
export default {
  name: 'FormSection',
  props: {
    title: {
      type: String,
      required: true
    },
    noDivider: {
      type: Boolean,
      default: false
    }
  }
}
</script>
