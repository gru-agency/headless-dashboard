const COLLECTION = 'products'

const state = () => ({
  /**
   * Keep unique document for client-side browsing.
   */
  all: [],

  /**
   * Keep track last fetched updated timestamp to avoid
   * fetching unchanged documents.
   * Format: { timestamp, owner }
   */
  fetchMetadata: [],
})

const getters = {
  /**
   * Filter list by account ID. Used to retrieve list.
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or undefined
   */
  filter: (state) => (account) => {
    return state.all.filter((el) => el.owner === account)
  },

  /**
   * Find object by ID and account ID. Used to retrieve
   * specific object.
   * @param {String} product ID of the object
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or undefined
   */
  find: (state) => (product, account) => {
    return state.all.find((el) => el.id === product && el.owner === account)
  },

  /**
   * Find next object after given timestamp by account. Used
   * for pagination to fetch delta changes up to returned object
   * to avoid over-fetched.
   * @param {Timestamp} timestamp current last visible timestamp
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or undefined
   */
  findNext: (state) => (timestamp, account) => {
    return state.all.find((el) => {
      return el.updated < timestamp && el.owner === account
    })
  },

  /**
   * Find fetch metadata object by account ID. Used to retrieve
   * specific fetch metadata.
   * @param {String} account ID of whose the data belongs to
   * @returns a fetch metadata object, or undefined
   */
  findFetchMetadata: (state) => (account) => {
    return state.fetchMetadata.find((el) => el.owner === account)
  },
}

const mutations = {
  /**
   * Insert or update data into collection depending
   * on object existence. Mutation will happen at the right
   * position based on updated timestamp in descending order.
   * @param {Object} payload full object to be mutated
   */
  UPSERT(state, payload) {
    const index = state.all.findIndex((el) => el.id === payload.id)
    if (index >= 0) {
      state.all.splice(index, 1)
      state.all.unshift(payload)
      return
    }

    const _index = state.all.findIndex((el) => {
      return payload.updated > el.updated
    })
    if (_index === -1) state.all.push(payload)
    else if (_index === 0) state.all.unshift(payload)
    else state.all.splice(_index, 0, payload)
  },

  /**
   * Remove fetch metadata of the given account. Best use when
   * terminate account.
   * @param {String} product ID of the object
   */
  DELETE(state, product) {
    const index = state.all.findIndex((el) => el.id === product)
    if (index >= 0) state.all.splice(index, 1)
  },

  /**
   * Set fetch metadata of the given account. Value will only
   * be added when not found in cache, or updated when given
   * timestamp value is greater than in the cache. Best use
   * when fetching list.
   * @param {Timestamp} timestamp last fetched timestamp
   * @param {String} account ID of whose the data belongs to
   */
  SET_FETCH_METADATA(state, { timestamp, account }) {
    const cache = state.fetchMetadata.find((el) => el.owner === account)
    if (cache) {
      if (timestamp > cache.timestamp) {
        const index = state.fetchMetadata.findIndex((el) => el.owner === account)
        state.fetchMetadata.splice(index, 1)
        state.fetchMetadata.unshift({ owner: account, timestamp })
      }
    } else state.fetchMetadata.unshift({ owner: account, timestamp })
  },

  /**
   * Remove fetch metadata of the given account. Best use when
   * terminate account.
   * @param {String} account ID of whose the data belongs to
   */
  CLEAR_FETCH_METADATA(state, account) {
    const result = state.fetchMetadata.filter((el) => el.owner !== account)
    state.fetchMetadata = result
  },
}

const actions = {
  /**
   * Create new object in the collection.
   * @param {String} document ID of a document
   * @param {Object} payload full object to be inserted
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or an error.
   */
  async create({ dispatch }, { document, payload, account }) {
    const { $fire, $fireModule, $log, $util } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      document = document || $util.nanoid()

      const { ...dirty } = {
        ...payload,
        active: true,
        owner: account,
        created: FieldValue.serverTimestamp(),
        updated: FieldValue.serverTimestamp(),
      }
      $log.tag('products').debug('[create] prod_%s by acct_%s %o', document, account, dirty)

      await $fire.firestore
        .collection(COLLECTION)
        .doc(document)
        .set({ ...dirty })

      const saved = await dispatch('retrieve', { options: { source: 'cache' }, document, account })
      $log.tag('products').success('[create]')
      return saved
    } catch (error) {
      $log.tag('products').error('[create]', error)
      throw error
    }
  },

  /**
   * Updates the specified object with the given payload.
   * @param {String} document ID of the document
   * @param {Object} payload full object to be updated
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or an error.
   */
  async update({ dispatch }, { document, payload, account }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      $log.tag('products').debug('[update] prod_%s by acct_%s %o', document, account, dirty)

      await $fire.firestore
        .collection(COLLECTION)
        .doc(document)
        .update({ ...dirty })

      const saved = await dispatch('retrieve', { options: { source: 'cache' }, document, account })
      $log.tag('products').success('[update]')
      return saved
    } catch (error) {
      $log.tag('products').error('[update]', error)
      throw error
    }
  },

  /**
   * Delete an object.
   * @param {String} document ID of the document
   * @param {String} account ID of whose the data belongs to
   */
  async delete({ commit }, { document, account }) {
    const { $fire, $log } = this.app.context
    try {
      $log.tag('products').debug('[delete] prod_%s by acct_%s', document, account)
      await $fire.firestore.collection(COLLECTION).doc(document).delete()
      commit('DELETE', document)
      $log.tag('products').success('[delete]')
    } catch (error) {
      $log.tag('products').error('[delete]', error)
      throw error
    }
  },

  /**
   * Retrieve the specified object with the given ID.
   * @param {String} options source of where the data to be fetched
   * @param {String} document ID of the document
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or an error.
   */
  async retrieve({ commit }, { options = { source: 'default' }, document, account }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION).doc(document)

      const snapshot = await _ref.get(options)
      $log.tag('products').debug('[retrieve] prod_%s by acct_%s %o', document, account, snapshot)

      if (!snapshot.exists) {
        commit('DELETE', document)
        $log.tag('products').success('[retrieve] Found none. Removing from local database.')
        return
      }

      const data = snapshot.data()
      const prices = []
      for (const key in data.prices) {
        const priceData = data.prices[key]
        const price = { ...priceData, id: key, updated: priceData.updated.toDate() }
        prices.push(price)
      }
      const product = {
        ...data,
        prices, // override original prices (object) with array
        id: snapshot.id,
        object: 'product',
        created: data.created.toDate(),
        updated: data.updated.toDate(),
      }

      if (product.owner !== account) {
        $log.tag('products').warn('[retrieve] Unauthorize. prod_%s by acct_%s', document, account)
        return
      }

      commit('UPSERT', product)
      $log.tag('products').debug('[retrieve] prod_%s by acct_%s %o', document, account, product)
      $log.tag('products').success('[retrieve]')
      return product
    } catch (error) {
      $log.tag('products').error('[retrieve]', error)
      throw error
    }
  },

  /**
   * Retrieve list of related object. Search from last fetched timestamp
   * if found.
   * @param {Number} limit maximum documents to be returned
   * @param {String} account ID of whose the data belongs to
   * @returns a list if a valid identifier was provided. Returns an error otherwise.
   */
  async list({ commit, getters }, { limit = 10, account }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION)
      let _query = _ref.where('owner', '==', account).orderBy('updated', 'desc').limit(limit)

      const _fetchMetadata = getters.findFetchMetadata(account)
      if (_fetchMetadata) _query = _query.where('updated', '>', _fetchMetadata.timestamp)

      const _fromCache = await _query.get({ source: 'cache' })
      const { empty, size, metadata, query } = _fromCache
      $log.tag('products').debug('[list] by acct_%s %o', account, {
        empty,
        size,
        source: metadata.fromCache ? 'cache' : 'server',
        query: query._delegate?._query?.T?.h,
      })

      let _fromServer
      if (empty) {
        _fromServer = await _query.get({ source: 'server' })
        const { empty, size, metadata, query } = _fromServer
        $log.tag('products').debug('[list] by acct_%s %o', account, {
          empty,
          size,
          source: metadata.fromCache ? 'cache' : 'server',
          query: query._delegate?._query?.T?.h,
        })
      }

      const fetchMetadata = { account, timestamp: Date.now() }
      commit('SET_FETCH_METADATA', fetchMetadata)
      $log.tag('products').debug('[list] Set last fetched timestamp %o', fetchMetadata)

      const snapshot = _fromServer || _fromCache
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        const prices = []
        for (const key in data.prices) {
          const priceData = data.prices[key]
          const price = { ...priceData, id: key, updated: priceData.updated.toDate() }
          prices.push(price)
        }
        const product = {
          ...data,
          prices, // override original prices (object) with array
          id: doc.id,
          object: 'product',
          created: data.created.toDate(),
          updated: data.updated.toDate(),
        }
        commit('UPSERT', product)
      })

      $log.tag('products').success('[list]')
      return snapshot
    } catch (error) {
      $log.tag('products').error('[list]', error)
      throw error
    }
  },

  /**
   * Retrieve list of related object based on result of list().
   * @param {Number} limit maximum documents to be returned
   * @param {String} account ID of whose the data belongs to
   * @param {Timestamp} endBefore timestamp of the first/last visible item
   * @returns a list if a valid identifier was provided. Returns an error otherwise.
   */
  async paginate({ commit, getters }, { limit = 10, account, endBefore }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION)
      let _query = _ref.where('owner', '==', account).orderBy('updated', 'desc').limit(limit)

      if (endBefore) _query = _query.where('updated', '<', endBefore)

      const next = getters.findNext(endBefore, account)
      if (next) _query = _query.endBefore(next.updated)

      const snapshot = await _query.get()
      const { empty, size, metadata, query } = snapshot
      $log.tag('products').debug('[paginate] by acct_%s %o', account, {
        empty,
        size,
        source: metadata.fromCache ? 'cache' : 'server',
        query: query._delegate?._query?.T?.h,
      })

      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        const prices = []
        for (const key in data.prices) {
          const priceData = data.prices[key]
          const price = { ...priceData, id: key, updated: priceData.updated.toDate() }
          prices.push(price)
        }
        const product = {
          ...data,
          prices, // override original prices (object) with array
          id: doc.id,
          object: 'product',
          created: data.created.toDate(),
          updated: data.updated.toDate(),
        }
        commit('UPSERT', product)
      })

      $log.tag('products').success('[paginate]')
      return snapshot
    } catch (error) {
      $log.tag('products').error('[paginate]', error)
      throw error
    }
  },

  /**
   * Set price for the given product.
   * @param {String} document ID of the document
   * @param {Object} price object to be updated
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or an error.
   */
  async setPrice({ dispatch }, { document, price, account }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      const { id, ...data } = price
      const payload = {
        [`prices.${id}`]: { ...data, updated: FieldValue.serverTimestamp() },
        updated: FieldValue.serverTimestamp(),
      }
      $log.tag('products').debug('[setPrice] prod_%s by acct_%s %o', document, account, payload)

      await $fire.firestore.collection(COLLECTION).doc(document).update(payload)

      const saved = await dispatch('retrieve', { options: { source: 'cache' }, document, account })
      $log.tag('products').success('[setPrice]')
      return saved
    } catch (error) {
      $log.tag('products').error('[setPrice]', error)
      throw error
    }
  },

  /**
   * Remove price from the given product.
   * @param {String} document ID of the document
   * @param {Object} price object to be updated
   * @param {String} account ID of whose the data belongs to
   * @returns a related object, or an error.
   */
  async removePrice({ dispatch }, { document, price, account }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      const { id } = price
      const payload = { [`prices.${id}`]: FieldValue.delete(), updated: FieldValue.serverTimestamp() }
      $log.tag('products').debug('[removePrice] prod_%s by acct_%s %o', document, account, payload)

      await $fire.firestore.collection(COLLECTION).doc(document).update(payload)

      const saved = await dispatch('retrieve', { options: { source: 'cache' }, document, account })
      $log.tag('products').success('[removePrice]')
      return saved
    } catch (error) {
      $log.tag('products').error('[removePrice]', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
