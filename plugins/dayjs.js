import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default ({ store }, inject) => {
  const _dayjs = dayjs

  function loadLocale(code) {
    import(`dayjs/locale/${code}.js`).then(() => _dayjs.locale(code))
  }

  const _util = {
    factory: _dayjs,

    switchLocale: (locale) => {
      if (locale.startsWith('ms')) {
        loadLocale('ms')
      } else if (locale.startsWith('zh')) {
        loadLocale('zh')
      } else {
        loadLocale('en')
      }
    },

    isAfter: (date1, date2) => {
      return _dayjs(date1).isAfter(_dayjs(date2))
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

  inject('dayjs', _util)
}
