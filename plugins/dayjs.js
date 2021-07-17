import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import 'dayjs/locale/ms'
import 'dayjs/locale/zh'

dayjs.extend(relativeTime)

export default (_, inject) => {
  const _dayjs = dayjs

  const _util = {
    factory: _dayjs,

    switchLocale: (locale) => {
      if (locale.startsWith('ms')) {
        _dayjs.locale('ms')
      } else if (locale.startsWith('zh')) {
        _dayjs.locale('zh')
      } else {
        _dayjs.locale('en')
      }
    },
  }

  inject('dayjs', _util)
}
