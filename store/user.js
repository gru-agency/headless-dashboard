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
      $log.trace('user.create', 'id=%s, dirty=%o', documentId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .set({ ...dirty })

      // fetch immediately
      const user = await dispatch('retrieve', { firebaseId: payload.firebaseId })
      $log.success('user.create', 'success')
      return user
    } catch (error) {
      $log.error('user.create', '%o', error)
      throw error
    }
  },

  async update({ dispatch }, { documentId, payload }) {
    const { $fire, $fireModule, $log } = this.app.context
    const { FieldValue } = $fireModule.firestore
    try {
      // remove local props + globally add necessary meta props
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      $log.trace('user.create', 'id=%s, dirty=%o', documentId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .update({ ...dirty })

      // fetch immediately
      const user = await dispatch('retrieve', { firebaseId: payload.firebaseId })
      $log.success('user.update', 'success')
      return user
    } catch (error) {
      $log.error('user.update', '%o', error)
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
      $log.trace(
        'user.retrieve',
        'empty=%s, size=%d, source=%s, query=%s',
        empty,
        size,
        metadata.fromCache ? 'cache' : 'server',
        query._delegate?._query?.T?.h
      )

      // fallback to server when found nothing on cache
      let _fromServer
      if (empty) {
        _fromServer = await _ref.get({ source: 'server' })
        const { empty, size, metadata, query } = _fromServer
        $log.trace(
          'user.retrieve',
          'empty=%s, size=%d, source=%s, query=%s',
          empty,
          size,
          metadata.fromCache ? 'cache' : 'server',
          query._delegate?._query?.T?.h
        )
      }

      // put all the information together into an object before goes to state
      const results = _fromServer || _fromCache
      if (!results.empty) {
        const doc = results.docs[0]
        const account = { ...doc.data().account, object: 'account' }
        const user = { ...doc.data(), id: doc.id, account, object: 'user' }
        $log.trace('user.retrieve', 'user=%o', user)
        commit('SET', user)

        $log.success('user.retrieve', 'success')
        return user
      }
    } catch (error) {
      $log.error('user.retrieve', '%o', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
