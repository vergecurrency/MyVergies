<template>
  <div>
    <navigation-header :title="$i18n.t('settings.settings')" />
    <div class="box">

      <form-section :title="$i18n.t('settings.settings')" no-divider>
        <b-field
          horizontal
          :label="$i18n.t('settings.language')"
          message="Language, Taal, Idioma, Sprache, Langue, Língua, linguaggio, язык, 語言, 언어, لغة"
        >
          <b-select v-model="language" expanded icon="globe">
            <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang" v-html="lang"/>
          </b-select>
        </b-field>

        <b-field horizontal :label="$i18n.t('settings.currency')" :message="$i18n.t('settings.currencyDetails')">
          <b-select v-model="currency" expanded icon="money-bill">
            <option v-for="(currency, i) in currencies" :key="`Currency${i}`" :value="currency" v-html="currency"/>
          </b-select>
        </b-field>
      </form-section>

      <form-section :title="$i18n.t('settings.security')">
        <b-field horizontal :label="$i18n.t('settings.password')">
          <b-button v-html="$i18n.t('settings.changePassword')" type="is-light" @click="changePassword"/>
        </b-field>

        <b-field horizontal :label="$i18n.t('settings.lockAfter')" :message="$i18n.t('settings.lockAfterDetails')">
          <b-select v-model="lockAfter" expanded icon="lock">
            <option v-for="(lock, i) in locks" :key="`Currency${i}`" :value="i" v-html="lock"/>
          </b-select>
        </b-field>
      </form-section>

      <form-section :title="$i18n.t('settings.connection')">
        <b-field horizontal :label="$i18n.t('settings.torConnection')">
          <b-button v-html="$i18n.t('settings.manageTorConnection')" type="is-light"/>
        </b-field>
      </form-section>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import locales from '@/locale/locales'
import currencies from '@/utils/currencies'
import NavigationHeader from '@/components/layout/NavigationHeader'
import FormSection from '@/components/layout/FormSection'
import ChangePinModal from '@/views/Settings/ChangePinModal'

export default {
  name: 'settings-view',
  components: { FormSection, NavigationHeader },
  data () {
    return {
      langs: Object.keys(locales),
      currencies: currencies,
      lockAfter: '5m',
      locks: {
        '5m': '5 Minutes',
        '10m': '10 Minutes',
        '20m': '20 Minutes',
        '30m': '30 Minutes'
      }
    }
  },
  computed: {
    language: {
      get () {
        return this.currentLanguageCode()
      },
      set (value) {
        this.updateLanguage(value)
        this.$i18n.locale = value
      }
    },
    currency: {
      get () {
        return this.currentCurrencyCode()
      },
      set (value) {
        this.updateCurrency(value)
        this.$root.loadData()
      }
    }
  },
  methods: {
    ...mapGetters(['currentCurrencyCode', 'currentLanguageCode']),
    ...mapActions(['updateCurrency', 'updateLanguage']),

    changePassword () {
      this.$buefy.modal.open({
        component: ChangePinModal,
        parent: this,
        canCancel: ['escape', 'outside'],
        hasModalCard: true,
        trapFocus: true
      })
    }
  }
}
</script>
