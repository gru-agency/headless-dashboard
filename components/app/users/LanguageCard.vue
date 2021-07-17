<template>
  <b-card no-body>
    <box-header :title-text="ui.title" :subtitle-text="ui.subtitle">
      <template #right>
        <action-button preset="bv-save" variant="primary" size="sm" @click="switchLocale()"></action-button>
      </template>
    </box-header>

    <b-card-body>
      <b-col cols="12" lg="6">
        <b-form-select v-model="selected">
          <b-form-select-option :value="null">{{ ui.autoDetect }}</b-form-select-option>
          <b-select-option v-for="lang in $i18n.locales" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </b-select-option>
        </b-form-select>
      </b-col>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'LanguageCard',

  data() {
    return {
      ui: {
        title: this.$t('modules.users.languageTitle'),
        subtitle: this.$t('modules.users.languageSubtitle'),
        autoDetect: this.$t('general.autoDetect'),
      },
      selected: null,
    }
  },

  methods: {
    switchLocale() {
      let _lang = this.selected
      if (!this.selected) _lang = this.$i18n.getBrowserLocale()

      if (this.$nuxt.context.isDev) {
        this.$util.info(
          'lang | (browser, cookie, selected)',
          this.$i18n.getBrowserLocale(),
          this.$i18n.getLocaleCookie(),
          _lang
        )
      }

      this.$root.$i18n.setLocale(_lang)
    },
  },
}
</script>
