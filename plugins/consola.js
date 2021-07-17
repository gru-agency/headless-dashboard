import consola from 'consola'

export default ({ isDev }, inject) => {
  const _logger = consola

  const _util = {
    factory: _logger,

    debug: (message, ...args) => {
      if (isDev) _logger.info(message, ...args)
    },

    info: (message, ...args) => {
      if (isDev) _logger.info(message, ...args)
    },

    success: (message, ...args) => {
      if (isDev) _logger.success(message, ...args)
    },

    error: (message, ...args) => {
      if (isDev) _logger.error(message, ...args)
    },
  }

  inject('log', _util)
}
