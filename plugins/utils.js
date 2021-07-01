const ui = {
  getTextVariant: (variant) => {
    if (variant === 'primary') return ' text-primary '
    else if (variant === 'secondary') return ' text-secondary '
    else if (variant === 'light') return ' text-light '
    else if (variant === 'dark') return ' text-dark '
    else if (variant === 'info') return ' text-info '
    else if (variant === 'danger') return ' text-danger '
    else if (variant === 'warning') return ' text-warning '
    else return undefined
  },
}

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
  getParentRoute: (path) => {
    return path.substr(0, path.lastIndexOf('/'))
  },

  // random: () => {
  //   return Math.random().toString(36).slice(2)
  // },

  // editMode: (path) => {
  //   return path.split('/').pop() === 'edit'
  // },
}

export default (_, inject) => {
  inject('ui', ui)
  inject('app', app)
  inject('date', date)
  inject('utils', utils)
}
