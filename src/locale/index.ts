import VueI18n from 'vue-i18n'
import Vue from 'vue'
import locales from '@/locale/locales'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: locales
})
