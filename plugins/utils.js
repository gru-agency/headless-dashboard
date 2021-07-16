import * as consola from 'consola'
import { nanoid } from 'nanoid'

const _util = {
  info: (message, varargs) => consola.info(message, varargs),
  error: (message, varargs) => consola.error(message, varargs),

  extractParentPath: (path) => {
    return path.substr(0, path.lastIndexOf('/'))
  },

  nanoid: (length) => (length ? nanoid(length) : nanoid()),
}

const _validation = {
  state: ({ validated, field, valid }, fieldName) => {
    return validated ? (field === fieldName ? valid : null) : null
  },

  evalState: (client, server) => {
    return server === null ? client : client && server
  },

  error: (states) => states.message,
}

export default (_, inject) => {
  inject('util', _util)
  inject('val', _validation)
}
