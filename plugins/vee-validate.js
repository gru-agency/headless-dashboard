import Vue from 'vue'
import { localize, extend, ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'

async function loadLocale(code) {
  const locale = await import(`vee-validate/dist/locale/${code}.json`)
  localize(code, locale)
}

const switchLocale = (locale) => {
  if (locale.startsWith('ms')) {
    loadLocale('ms_MY')
  } else if (locale.startsWith('zh')) {
    loadLocale('zh_CN')
  } else {
    loadLocale('en')
  }
}

export default (_, inject) => {
  inject('switchLocale', switchLocale)
}

// default to en
localize('en', en)

extend('required', required)
extend('email', email)

// register globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
