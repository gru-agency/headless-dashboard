const COLLECTION = 'users'

const state = () => ({
  user: null,
})

const getters = {
  accountId: (state) => {
    return state.user?.account?.id
  },
}

const mutations = {
  SET: (state, payload) => {
    payload.object = 'user'
    state.user = { ...state.user, ...payload }
  },
}

const actions = {
  async add({ commit }, { documentId, payload }) {
    const { $fire, $fireModule, $log, $util } = this.app.context
    const { FieldValue, Timestamp } = $fireModule.firestore
    try {
      documentId = documentId || $util.nanoid()

      // remove local props + add necessary meta props
      const { lastLogin, tokenExpired, emailVerified, ...dirty } = {
        ...payload,
        created: FieldValue.serverTimestamp(),
        account: { id: $util.nanoid() },
      }
      $log.debug(`user | add | id: ${documentId}, dirty: ${$util.stringify(dirty)}`)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .set({ ...dirty })

      // Proper: fetch data from server
      // Fallback: commit directly (losing server info, but can afford slight inaccuracy)
      commit('SET', { ...payload, id: documentId, created: Timestamp.fromDate(new Date()) })

      $log.success(`user | add | success`)
    } catch (error) {
      $log.error(`user | add | error: ${error}`)
      throw error
    }
  },

  async update({ commit }, { documentId, payload }) {
    const { $fire, $fireModule, $log, $util } = this.app.context
    const { FieldValue, Timestamp } = $fireModule.firestore
    try {
      // remove local props + globally add necessary meta props
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      $log.debug(`user | update | id: ${documentId}, dirty: ${$util.stringify(dirty)}`)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(documentId)
        .update({ ...dirty })

      // Proper: fetch data from server
      // Fallback: commit directly (losing server info, but can afford slight inaccuracy)
      commit('SET', { ...payload, id: documentId, updated: Timestamp.fromDate(new Date()) })

      $log.success(`user | update | success`)
    } catch (error) {
      $log.error(`user | update | error: ${error}`)
      throw error
    }
  },

  async get({ commit }, { firebaseId }) {
    const { $fire, $log, $util } = this.app.context
    try {
      // expect unique record with firebase id
      const snapshot = await $fire.firestore
        .collection(COLLECTION)
        .where('firebaseId', '==', firebaseId)
        .limit(1)
        .get()

      const doc = snapshot.docs[0]
      const { id, exists, metadata } = doc
      $log.debug(`user | get | id: ${id}, exists: ${exists}, metadata: ${$util.stringify(metadata)}`)

      // put all the information together into an object before goes to state
      const user = { ...doc.data(), id }
      $log.debug(`user | get | user: ${$util.stringify(user)}`)
      commit('SET', user)

      return user
    } catch (error) {
      $log.error(`user | get | error: ${error}`)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
