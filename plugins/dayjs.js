import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import 'dayjs/locale/ms'
import 'dayjs/locale/zh'

dayjs.extend(relativeTime)

const util = {
  init: () => dayjs,

  switchLocale: (locale) => {
    if (locale.startsWith('ms')) {
      dayjs.locale('ms')
    } else if (locale.startsWith('zh')) {
      dayjs.locale('zh')
    } else {
      dayjs.locale('en')
    }
  },
}

export default (_, inject) => {
  inject('dayjs', util)
}
