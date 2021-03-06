import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'
import { name, os } from 'platform'

export default ({ _ }, inject) => {
  const _util = {
    nanoid: (length) => customAlphabet(alphanumeric, length || 21)(),

    platformDescription: () => `${name} - ${os.family}`,

    extractParentPath: (path) => {
      return path.substr(0, path.lastIndexOf('/'))
    },
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

  inject('util', _util)
  inject('val', _validation)
}
