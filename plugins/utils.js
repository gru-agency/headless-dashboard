import * as consola from 'consola'
import { nanoid } from 'nanoid'
import { name, os } from 'platform'

const _util = {
  info: (message, varargs) => consola.info(message, varargs),
  error: (message, varargs) => consola.error(message, varargs),

  nanoid: (length) => (length ? nanoid(length) : nanoid()),

  extractParentPath: (path) => {
    return path.substr(0, path.lastIndexOf('/'))
  },

  platformDescription: () => `${name} - ${os.family}`,
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
