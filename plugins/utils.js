const app = {
  brandName: 'Shoplex',
  // countries: () => {
  //   return [{ code: 'my', name: 'Malaysia' }]
  // },
}

const date = {
  standard: (date, locale) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(date).toLocaleDateString(locale, options)
  },
}

const utils = {
  print: (msg) => {
    window.console.log(msg)
  },
  printj: (msg) => {
    window.console.log(JSON.stringify(msg))
  },

  // random: () => {
  //   return Math.random().toString(36).slice(2)
  // },

  // editMode: (path) => {
  //   return path.split('/').pop() === 'edit'
  // },
}

export default (inject) => {
  inject('app', app)
  inject('date', date)
  inject('utils', utils)
}
