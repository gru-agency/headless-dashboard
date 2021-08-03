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

      const cache = state.caches.find((el) => el.ipv4 === currentIp4)
      $log.tag('user_sessions').debug('[add] Find ipv4=%s in cache %o', currentIp4, cache)

      // only fetch if cache miss
      let geodb
      if (!cache) {
        const _geodb = await this.$axios.$get(`https://geolocation-db.com/json/${$config.gdb}`)
        $log.tag('user_sessions').debug('[add] Request geolocation %o', _geodb)
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
      $log.tag('user_sessions').debug('[add] Set session %o', payload)

      $log.tag('user_sessions').success('[add]')
    } catch (error) {
      $log.tag('user_sessions').error('[add]', error)
      throw error
    }
  },

  clear({ commit }) {
    const { $log } = this.app.context
    commit('CLEAR_SESSION')
    $log.tag('user_sessions').success('[clear]')
  },
}

export default { state, getters, actions, mutations }
