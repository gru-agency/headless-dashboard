import debug from 'debug'
;(() => {
  if (process.browser) localStorage.setItem('debug', 'udb:*')
})()

export default ({ isDev }, inject) => {
  const logger = {
    success: (module, message, ...args) => {
      if (isDev) debug(`udb:${module} [SUCCESS]`)(message, ...args)
    },

    trace: (module, message, ...args) => {
      if (isDev) debug(`udb:${module} [TRACE]`)(message, ...args)
    },

    info: (module, message, ...args) => {
      if (isDev) debug(`udb:${module} [INFO]`)(message, ...args)
    },

    warn: (module, message, ...args) => {
      if (isDev) debug(`udb:${module} [WARN]`)(message, ...args)
    },

    error: (module, message, ...args) => {
      if (isDev) debug(`udb:${module} [ERROR]`)(message, ...args)
    },
  }

  inject('log', logger)
}
