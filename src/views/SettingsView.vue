<template>
  <div>
    <navigation-header title="Settings"/>
    <div class="box">
        <div class="level">
          <label class="is-size-5 has-text-weight-bold level-left" v-html="'Language'"/>
          <select class="level-right" id="language-select" v-model="$i18n.locale">
            <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
          </select>
        </div>
    </div>
  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
import messages from '../utils/i18n'

export default {
  name: 'settings-view',
  components: { NavigationHeader },
  data () {
    return { langs: Object.keys(messages) }
  }
}
</script>

<style scoped>
</style>
