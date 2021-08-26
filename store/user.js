const COLLECTION = 'users'

const state = () => ({
  user: null,

  accountPublicProfile: {
    brandName: null,
    supportEmail: null,
    supportPhone: null,
    supportAddress: {
      address: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
    },
  },

  accountBusinessOperation: {
    openingHour: null,
    vacation: false,
    vacationStart: null,
    vacationEnd: null,
    vacationNotice: null,
  },
})

const getters = {
  account: (state) => state.user?.account.id,

  accountPublicProfile: (state) => {
    return state.user?.account.publicProfile || state.accountPublicProfile
  },

  accountBusinessOperation: (state) => {
    const bizOps = state.user?.account.businessOperation
    if (!bizOps) return state.accountBusinessOperation

    const { vacationStart, vacationEnd, ...rest } = bizOps
    return { ...rest, vacationStart: vacationStart?.toDate(), vacationEnd: vacationEnd?.toDate() }
  },
}

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
      const user = await dispatch('retrieve', { options: { source: 'cache' }, document: documentId })
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
      const user = await dispatch('retrieve', { options: { source: 'cache' }, document: documentId })
      $log.tag('user').success('[update]')
      return user
    } catch (error) {
      $log.tag('user').error('[update]', error)
      throw error
    }
  },

  async retrieve({ commit }, { options = { source: 'default' }, document }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION).doc(document)

      const snapshot = await _ref.get(options)
      $log.tag('user').debug('[retrieve] user_%s %o', document, snapshot)

      if (!snapshot.exists) {
        $log.tag('user').error('[retrieve] Found none user_%s', document)
        return
      }

      // put all the information together into an object before goes to state
      const data = snapshot.data()
      const account = { ...data.account, object: 'account' }
      const user = { ...data, id: snapshot.id, account, object: 'user' }
      commit('SET', user)
      $log.tag('user').debug('[retrieve] Setting object to store %o', user)

      $log.tag('user').success('[retrieve]')
      return user
    } catch (error) {
      $log.tag('user').error('[retrieve]', error)
      throw error
    }
  },

  async retrieveByFirebaseId({ commit }, { firebaseId }) {
    const { $fire, $log } = this.app.context
    try {
      const _ref = $fire.firestore.collection(COLLECTION).where('firebaseId', '==', firebaseId).limit(1)

      const results = await _ref.get()
      const { empty, size, metadata, query } = results
      $log.tag('user').debug('[retrieve] by fbid_%s %o', firebaseId, {
        empty,
        size,
        source: metadata.fromCache ? 'cache' : 'server',
        query: query._delegate?._query?.T?.h,
      })

      if (results.empty) {
        $log.tag('user').warn('[retrieve] Found none fbid_%s', firebaseId)
        return
      }

      if (results.size > 1) {
        $log.tag('user').error('[retrieve] Found more than ONE with fbid_%s', firebaseId)
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
