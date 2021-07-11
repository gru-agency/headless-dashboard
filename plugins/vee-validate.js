import Vue from 'vue'
import {
  localize,
  extend,
  setInteractionMode,
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate'
import { required, email, min, max } from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'

async function loadLocale(code) {
  const locale = await import(`vee-validate/dist/locale/${code}.json`)
  localize(code, locale)
}

const util = {
  checkState: ({ touched, dirty, validated, valid = null }) => {
    return (touched && dirty) || validated ? valid : null
  },

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

export default (_, inject) => {
  inject('vee', util)
}

// default to en
localize('en', en)

extend('required', required)
extend('email', email)
extend('min', min)
extend('max', max)

// less offensive mode
setInteractionMode('eager')

// register globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
