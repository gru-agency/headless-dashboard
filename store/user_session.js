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
    const { $config, $util, isDev } = this.app.context
    try {
      const currentIp4 = await this.$axios.$get('https://api.ipify.org')
      if (isDev) $util.info('user_session | addSession | ipv4', currentIp4)

      const cache = state.caches.find((el) => el.ipv4 === currentIp4)
      if (isDev) $util.info('user_session | addSession | cache', cache)

      // only fetch if cache miss
      let geodb
      if (!cache) {
        const _geodb = await this.$axios.$get(`https://geolocation-db.com/json/${$config.geoDbKey}`)
        if (isDev) $util.info('user_session | addSession | geodb', _geodb)
        geodb = { ipv4: _geodb.IPv4, country: _geodb.country_name, source: 'geodb' }
      }

      // cache locally to reduce call
      const geolocation = cache || geodb
      if (geolocation) {
        commit('SET_CACHE', geolocation)
        if (isDev) $util.info('user_session | addSession | caches', state.caches)
      }

      commit('SET_SESSION', {
        location: geolocation?.country,
        ip: geolocation?.ipv4,
        time: claims.iat,
        device: $util.platformDescription(),
      })
      if (isDev) $util.info('user_session | addSession | sessions', state.all)
    } catch (error) {
      if (isDev) $util.error('user_session | addSession | error', error)
      throw error
    }
  },

  clear({ commit }) {
    const { $util, isDev } = this.app.context
    commit('CLEAR_SESSION')
    if (isDev) $util.info('user_session | clear', 'successful')
  },
}

export default { state, getters, actions, mutations }
