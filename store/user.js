const COLLECTION = 'users'

const state = () => ({
  user: null,
})

const getters = {}

const mutations = {
  SET: (state, payload) => (state.user = payload),
}

const actions = {
  async create({ dispatch }, { documentId, payload }) {
    const { $fire, $fireModule, $log, $util } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      documentId = documentId || $util.nanoid()

      // remove local props + add necessary meta props
      const { lastLogin, tokenExpired, emailVerified, ...dirty } = {
        ...payload,
        created: FieldValue.serverTimestamp(),
        account: { id: $util.nanoid() },
      }
      $log.tag('user').debug('[create] Creating %s with %o', documentId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .set({ ...dirty })

      // fetch immediately
      const user = await dispatch('retrieve', { firebaseId: payload.firebaseId })
      $log.tag('user').success('[create]')
      return user
    } catch (error) {
      $log.tag('user').error('[create]', error)
      throw error
    }
  },

  async update({ dispatch }, { documentId, payload }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      // remove local props + globally add necessary meta props
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      $log.tag('user').debug('[update] Updating %s with %o', documentId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .update({ ...dirty })

      // fetch immediately
      const user = await dispatch('retrieve', { firebaseId: payload.firebaseId })
      $log.tag('user').success('[update]')
      return user
    } catch (error) {
      $log.tag('user').error('[update]', error)
      throw error
    }
  },

  async retrieve({ commit }, { firebaseId }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION).where('firebaseId', '==', firebaseId).limit(1)

      // hit cache first
      const _fromCache = await _ref.get({ source: 'cache' })
      const { empty, size, metadata, query } = _fromCache
      $log.tag('user').debug('[retrieve] Retrieving %s from cache %o', firebaseId, {
        empty,
        size,
        source: metadata.fromCache ? 'cache' : 'server',
        query: query._delegate?._query?.T?.h,
      })

      // fallback to server when found nothing on cache
      let _fromServer
      if (empty) {
        _fromServer = await _ref.get({ source: 'server' })
        const { empty, size, metadata, query } = _fromServer
        $log.tag('user').debug('[retrieve] Retrieving %s from server %o', firebaseId, {
          empty,
          size,
          source: metadata.fromCache ? 'cache' : 'server',
          query: query._delegate?._query?.T?.h,
        })
      }

      const results = _fromServer || _fromCache
      if (results.empty) {
        $log.tag('user').warn('[retrieve] User not found with firebase ID %s', firebaseId)
        return
      }

      if (results.size > 1) {
        $log.tag('user').error('[retrieve] Found more than ONE user with firebase ID %s', firebaseId)
        return
      }

      // put all the information together into an object before goes to state
      const doc = results.docs[0]
      const account = { ...doc.data().account, object: 'account' }
      const user = { ...doc.data(), id: doc.id, account, object: 'user' }
      commit('SET', user)
      $log.tag('user').debug('[retrieve] Setting object to store %o', user)

      $log.tag('user').success('[retrieve]')
      return user
    } catch (error) {
      $log.tag('user').error('[retrieve]', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
