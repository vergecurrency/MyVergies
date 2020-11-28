<template>
 <div class="form-section">
   <div v-if="!noDivider" class="navbar-divider"/>
   <slot name="title">
     <h6 class="title is-6 has-text-grey-light" v-html="title"/>
   </slot>
   <div>
     <slot/>
   </div>
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

<style>
.form-section {
  padding: 10px 0;
}
.form-section:first-child {
  padding-top: 0;
}
.form-section:last-child {
  padding-bottom: 0;
}
</style>
