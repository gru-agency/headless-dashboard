import consola from 'consola'

const logger = {
  tag: (tag) => {
    return consola.withTag(tag)
  },
}

export default ({ isDev }, inject) => {
  inject('log', logger)

  /**
   * set log level upon initialization
   * no log output if production
   */
  ;(() => {
    consola.level = isDev ? 4 : -1
  })()
}
