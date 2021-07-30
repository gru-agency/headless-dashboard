const state = () => ({
  all: [],
  caches: [],
})

const getters = {}

const mutations = {
  SET_SESSION: (state, payload) => {
    if (state.all.unshift(payload) > 5) state.all.pop()
  },

  CLEAR_SESSION: (state) => (state.all = []),

  SET_CACHE: (state, payload) => {
    if (state.caches.unshift(payload) > 5) state.caches.pop()
  },
}

const actions = {
  async add({ commit, state }, claims) {
    const { $config, $log, $util } = this.app.context
    try {
      const currentIp4 = await this.$axios.$get('https://api.ipify.org')
      $log.trace('user_sessions.add', 'ipv4=%s', currentIp4)

      const cache = state.caches.find((el) => el.ipv4 === currentIp4)
      $log.trace('user_sessions.add', 'caches=%o', cache)

      // only fetch if cache miss
      let geodb
      if (!cache) {
        const _geodb = await this.$axios.$get(`https://geolocation-db.com/json/${$config.gdb}`)
        $log.trace('user_sessions.add', 'geodb=%o', _geodb)
        geodb = { ipv4: _geodb.IPv4, country: _geodb.country_name, source: 'geodb' }
      }

      // cache locally to reduce call
      const geolocation = cache || geodb
      if (geolocation) commit('SET_CACHE', geolocation)

      const payload = {
        location: geolocation?.country,
        ip: geolocation?.ipv4,
        time: claims.iat,
        device: $util.platformDescription(),
      }
      commit('SET_SESSION', payload)
      $log.trace('user_sessions.add', 'payload=%o', payload)

      $log.success('user_sessions.add', 'success')
    } catch (error) {
      $log.error('user_sessions.add', '%o', error)
      throw error
    }
  },

  clear({ commit }) {
    const { $log } = this.app.context
    commit('CLEAR_SESSION')
    $log.success('user_sessions.clear', 'success')
  },
}

export default { state, getters, actions, mutations }
