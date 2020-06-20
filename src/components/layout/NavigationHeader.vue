<template>
  <div ref="header" class="box navigation-header">
    <div class="columns is-vcentered">
      <div v-if="back" class="column is-narrow">
        <router-link
          class="button"
          :to="back"
        >
          <b-icon icon="angle-left" size="is-small"/>
        </router-link>
      </div>
      <div class="column">
        <p class="is-size-3 is-family-handwritten" v-html="title"/>
      </div>
      <div class="column is-narrow">
        <slot name="right"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navigation-header',

  props: {
    back: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      required: true
    }
  },

  mounted () {
    const header = this.$refs.header
    const sticky = header.offsetTop - 52

    let appContentBox = null
    let parent = this.$parent
    while (appContentBox === null && parent !== null) {
      if (parent.$refs.appContentBox) {
        appContentBox = parent.$refs.appContentBox
      }

      parent = parent.$parent
    }

    appContentBox.onscroll = (e) => {
      if (appContentBox.scrollTop > sticky) {
        header.classList.add('sticky')
        this.$parent.$el.classList.add('has-sticky')
      } else {
        header.classList.remove('sticky')
        this.$parent.$el.classList.remove('has-sticky')
      }
    }
  }
}
</script>

<style>
.navigation-header.sticky {
  position: fixed;
  width: 100%;
  top: 52px;
  margin: 0 -31px;
  z-index: 1;
  border-radius: 0;
  padding: 10px 30px;
  transition-property: all;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.has-sticky {
  padding-top: 113px;
}
</style>
