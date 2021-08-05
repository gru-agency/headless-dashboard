/* eslint-disable camelcase */
import Vue from 'vue'
import { localize, extend, setInteractionMode, ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email, min, max, min_value, integer } from 'vee-validate/dist/rules'

export default ({ store }, inject) => {
  async function loadLocale(code) {
    const locale = await import(`vee-validate/dist/locale/${code}.json`)
    localize(code, locale)
  }

  const _util = {
    state: ({ touched, dirty, validated, valid = null }) => {
      return (touched && dirty) || validated ? valid : null
    },

    error: (states) => states.errors[0],

    switchLocale: (locale) => {
      if (locale.startsWith('ms')) {
        loadLocale('ms_MY')
      } else if (locale.startsWith('zh')) {
        loadLocale('zh_CN')
      } else {
        loadLocale('en')
      }
    },
  }

  // iife: self-init locale setting
  // note: place this after all handy utils loaded
  ;(() => {
    const browser = store.$i18n.getBrowserLocale()
    const cookie = store.$i18n.getLocaleCookie()

    // priority: cookie > browser > default(en)
    const finalLocale = cookie || browser || 'en'

    _util.switchLocale(finalLocale)
  })()

  inject('vee', _util)
}

extend('required', required)
extend('email', email)
extend('min', min)
extend('min_value', min_value)
extend('max', max)
extend('integer', integer)

// custom rules for password
extend('hint_pw', {
  validate(value, args) {
    return value.length >= args.length
  },
  params: ['length'],
  message:
    'Your password needs to be at least 10 characters, include multiple words and phrases to make it more secure.',
})

// less offensive mode
setInteractionMode('eager')

// register globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
