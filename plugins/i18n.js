export default function ({ app }) {
  app.i18n.onLanguageSwitched = (_oldLocale, newLocale) => {
    app.$vee.switchLocale(newLocale)
  }
}
