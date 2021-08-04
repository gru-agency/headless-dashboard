const COLLECTION = 'products'

const state = () => ({
  // keep unique document only
  all: [],

  // - use to fetch recent delta changes only
  // - support multiple accounts
  caches: [],
})

const getters = {
  findByOwner: (state) => (owner) => {
    return state.all.filter((el) => el.owner === owner)
  },

  findActiveByOwner: (state) => (owner) => {
    return state.all.filter((el) => el.owner === owner && el.active === true)
  },

  findArchiveByOwner: (state) => (owner) => {
    return state.all.filter((el) => el.owner === owner && el.active === false)
  },

  findByProduct: (state) => (product, owner) => {
    return state.all.find((el) => el.id === product && el.owner === owner)
  },

  findCache: (state) => (owner, hash) => {
    return state.caches.find((el) => el.owner === owner && el.hash === hash)
  },
}

const mutations = {
  // not in used currently
  INSERT(state, payload) {
    if (state.all.some((el) => el.id === payload.id)) return
    state.all.unshift(payload)
  },

  // not in used currently
  UPDATE(state, payload) {
    const index = state.all.findIndex((el) => el.id === payload.id)
    const current = state.all.find((el) => el.id === payload.id)
    // since update only on subset, override current with subset changes
    if (index >= 0) {
      state.all.splice(index, 1)
      state.all.unshift({ ...current, ...payload })
    }
  },

  /**
   * smartly insert into the array based on time factor
   */
  UPSERT(state, payload) {
    const index = state.all.findIndex((el) => el.id === payload.id)
    if (index >= 0) {
      state.all.splice(index, 1)
      state.all.unshift(payload)
    } else {
      const { $dayjs } = this.app.context
      const _index = state.all.findIndex((el) => {
        return $dayjs.factory(payload.updated.toDate()).isAfter($dayjs.factory(el.updated.toDate()))
      })
      if (_index === -1) state.all.push(payload)
      else if (_index === 0) state.all.unshift(payload)
      else state.all.splice(_index, 0, payload)
    }
  },

  // not in used currently
  DELETE(state, product) {
    const index = state.all.findIndex((el) => el.id === product)
    if (index >= 0) state.all.splice(index, 1)
  },

  /**
   * only update if value greater than cached one
   */
  SET_CACHE(state, { owner, timestamp, hash }) {
    const index = state.caches.findIndex((el) => el.owner === owner && el.hash === hash)
    if (index >= 0) {
      const cached = state.caches.find((el) => el.owner === owner && el.hash === hash)
      const { $dayjs } = this.app.context
      if ($dayjs.factory(cached.timestamp.toDate()).isBefore($dayjs.factory(timestamp.toDate()))) {
        state.caches.splice(index, 1, { owner, timestamp, hash })
      }
    } else state.caches.unshift({ owner, timestamp, hash })
  },

  /**
   * wipe off all cache belongs to the account
   */
  CLEAR_CACHE(state, owner) {
    const result = state.caches.filter((el) => el.owner !== owner)
    state.caches = result
  },
}

const actions = {
  async create({ dispatch }, { documentId, payload, account }) {
    const { $fire, $fireModule, $log, $util } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      documentId = documentId || $util.nanoid()

      // add necessary props
      const { ...dirty } = {
        ...payload,
        owner: account,
        active: true,
        created: FieldValue.serverTimestamp(),
        updated: FieldValue.serverTimestamp(),
      }
      $log.tag('products').debug('[create] Creating %s with %o', documentId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .set({ ...dirty })

      // fetch immediately
      const product = await dispatch('retrieve', { documentId })
      $log.tag('products').success('[create]')
      return product
    } catch (error) {
      $log.tag('products').error('[create]', error)
      throw error
    }
  },

  async update({ dispatch }, { documentId, payload }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      // remove local props + globally add necessary meta props
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      $log.tag('products').debug('[update] Updating %s with %o ', documentId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .update({ ...dirty })

      // fetch immediately
      const product = await dispatch('retrieve', { documentId })
      $log.tag('products').success('[update]')
      return product
    } catch (error) {
      $log.tag('products').error('[update]', error)
      throw error
    }
  },

  async delete({ commit }, { documentId }) {
    const { $fire, $log } = this.app.context
    try {
      $log.tag('products').debug('[delete] Deleting %s', documentId)
      await $fire.firestore.collection(COLLECTION).doc(documentId).delete()
      commit('DELETE', documentId)

      $log.success('products.delete', 'success')
    } catch (error) {
      $log.tag('products').error('[delete]', error)
      throw error
    }
  },

  async retrieve({ commit }, { documentId }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION).doc(documentId)

      // hit cache first
      const _fromCache = await _ref.get({ source: 'cache' })
      const { id, exists, metadata } = _fromCache
      $log.tag('products').debug('[retrieve] Retrieving %s from cache %o', documentId, {
        id,
        exists,
        source: metadata.fromCache ? 'cache' : 'server',
      })

      // fallback to server when found nothing on cache
      let _fromServer
      if (!exists) {
        _fromServer = await _ref.get({ source: 'server' })
        const { id, exists, metadata } = _fromServer
        $log.tag('products').debug('[retrieve] Retrieving %s from server %o', documentId, {
          id,
          exists,
          source: metadata.fromCache ? 'cache' : 'server',
        })
      }

      // put all the information together into an object before goes to state
      const results = _fromServer || _fromCache
      const product = { ...results.data(), id, object: 'product' }
      commit('UPSERT', product)
      $log.tag('products').debug('[retrieve] Setting object to store %o', product)

      $log.tag('products').success('[retrieve]')
      return product
    } catch (error) {
      $log.tag('products').error('[retrieve]', error)
      throw error
    }
  },

  /**
   * Used to fetch latest and delta changes. Cache applies here.
   * @param {Object} equalQ {field, operator, value, hash}
   * @param {Object} rangeQ {field, operator, value, hash} NOT in use currently
   */
  async list({ commit }, { account, equalQ, rangeQ, fetchSize }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { Timestamp } = $fireModule.firestore
    try {
      // construct ref + query
      const _ref = $fire.firestore.collection(COLLECTION)
      let _query = _ref.where('owner', '==', account).orderBy('updated', 'desc')

      if (fetchSize) _query = _query.limit(fetchSize)
      if (equalQ) _query = _query.where(equalQ.field, equalQ.operator, equalQ.value)
      if (rangeQ) _query = _query.where(rangeQ.field, rangeQ.operator, rangeQ.value)

      // hit cache first
      // expecting work on repeated call from 'Next' pagination
      const _fromCache = await _query.get({ source: 'cache' })
      const { empty, size, metadata, query } = _fromCache
      $log.tag('products').debug('[list] Retrieving list of owner %s from cache %o', account, {
        empty,
        size,
        source: metadata.fromCache ? 'cache' : 'server',
        query: query._delegate?._query?.T?.h,
      })

      // fallback to server when found nothing on cache
      let _fromServer
      if (empty) {
        _fromServer = await _query.get({ source: 'server' })
        const { empty, size, metadata, query } = _fromServer
        $log.tag('products').debug('[list] Retrieving list of owner %s from server %o', account, {
          empty,
          size,
          source: metadata.fromCache ? 'cache' : 'server',
          query: query._delegate?._query?.T?.h,
        })
      }

      // cache regardless of result
      const cache = { owner: account, timestamp: Timestamp.fromDate(new Date()), hash: equalQ.hash }
      commit('SET_CACHE', cache)
      $log.tag('products').debug('[list] Setting object to cache %o', cache)

      const results = _fromServer || _fromCache
      results.docs.forEach((doc) => {
        // put all the information together into an object before goes to state
        const product = { ...doc.data(), id: doc.id, object: 'product' }
        commit('UPSERT', product)
      })

      $log.tag('products').success('[list]')
      return results.docs
    } catch (error) {
      $log.tag('products').error('[list]', error)
      throw error
    }
  },

  /**
   * For pagination only. Setting cache does not apply here
   * @param {Object} equalQ {field, operator, value, hash}
   * @param {Object} rangeQ {field, operator, value, hash} NOT in use currently
   */
  async paginate({ commit }, { account, equalQ, rangeQ, fetchSize }) {
    const { $fire, $log } = this.app.context
    try {
      // construct ref + query
      const _ref = $fire.firestore.collection(COLLECTION)
      let _query = _ref.where('owner', '==', account).orderBy('updated', 'desc')

      if (fetchSize) _query = _query.limit(fetchSize)
      if (equalQ) _query = _query.where(equalQ.field, equalQ.operator, equalQ.value)
      if (rangeQ) _query = _query.where(rangeQ.field, rangeQ.operator, rangeQ.value)

      // hit cache first
      // expecting work on repeated call from 'Next' pagination
      const _fromCache = await _query.get({ source: 'cache' })
      const { empty, size, metadata, query } = _fromCache
      $log.tag('products').debug('[paginate] Retrieving list of owner %s from cache %o', account, {
        empty,
        size,
        source: metadata.fromCache ? 'cache' : 'server',
        query: query._delegate?._query?.T?.h,
      })

      // fallback to server when found nothing on cache
      let _fromServer
      if (empty) {
        _fromServer = await _query.get({ source: 'server' })
        const { empty, size, metadata, query } = _fromServer
        $log.tag('products').debug('[paginate] Retrieving list of owner %s from server %o', account, {
          empty,
          size,
          source: metadata.fromCache ? 'cache' : 'server',
          query: query._delegate?._query?.T?.h,
        })
      }

      const results = _fromServer || _fromCache
      results.docs.forEach((doc) => {
        // put all the information together into an object before goes to state
        const product = { ...doc.data(), id: doc.id, object: 'product' }
        commit('UPSERT', product)
      })

      $log.tag('products').success('[paginate]')
      return results.docs
    } catch (error) {
      $log.tag('products').error('[paginate]', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
