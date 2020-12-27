<template>
  <div ref="header" class="navigation-header" :class="{ 'has-update-notification': hasUpdateNotification }">
    <div class="box">
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
    const sticky = header.offsetTop - this.hasUpdateNotification ? 101 : 52

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
  },

  computed: {
    hasUpdateNotification () {
      if (this.$root.$children[0]) {
        return this.$root.$children[0].hasUpdateNotification ?? false
      }

      return false
    }
  }
}
</script>

<style>
.navigation-header {
  transition-property: all;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  padding-bottom: 30px;
}

.navigation-header.sticky {
  position: fixed;
  width: 100%;
  top: 52px;
  margin: 0 -31px;
  z-index: 10;
}

.navigation-header.sticky.has-update-notification {
  top: 101px;
}

.navigation-header.sticky .box {
  width: 100%;
  padding: 10px 30px;
  border-radius: 0;
}

.has-sticky {
  padding-top: 120px;
}
</style>
