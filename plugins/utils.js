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
  supportMail: 'support@shoplex.com',
}

const utils = {
  getParentRoute: (path) => {
    return path.substr(0, path.lastIndexOf('/'))
  },

  /** priority non-null value first */
  evaluateState: (client, server) => {
    return client !== null ? client : server !== null ? server : null
  },
  // random: () => {
  //   return Math.random().toString(36).slice(2)
  // },
  // editMode: (path) => {
  //   return path.split('/').pop() === 'edit'
  // },
}

const validation = {
  state: ({ validated, field, valid }, fieldName) => {
    return validated ? (field === fieldName ? valid : null) : null
  },

  error: (states) => states.message,
}

export default (_, inject) => {
  inject('ui', ui)
  inject('app', app)
  inject('val', validation)
  inject('utils', utils)
}
