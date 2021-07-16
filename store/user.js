const COLLECTION = 'users'

const state = () => ({
  user: null,
})

const getters = {}

const mutations = {
  SET: (state, payload) => {
    payload.object = 'user'
    state.user = payload
  },
}

const actions = {
  async add({ commit }, { docId, payload }) {
    const { $fire, $fireModule, $util, isDev } = this.app.context
    const { FieldValue, Timestamp } = $fireModule.firestore
    try {
      docId = docId || $util.nanoid()

      // remove local props + globally add necessary meta props
      const { lastLogin, tokenExpired, ...dirty } = { ...payload, created: FieldValue.serverTimestamp() }
      if (isDev) $util.info('user | add | id, dirty', docId, dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(docId)
        .set({ ...dirty })

      // Proper: fetch data from server
      // Fallback: commit directly (losing server info, but can afford slight inaccuracy)
      commit('SET', { ...payload, id: docId, created: Timestamp.fromDate(new Date()) })
    } catch (error) {
      if (isDev) $util.error('user | add | error', error)
      throw error
    }
  },

  async update({ commit }, { docId, payload }) {
    const { $fire, $fireModule, $util, isDev } = this.app.context
    const { FieldValue, Timestamp } = $fireModule.firestore
    try {
      // remove local props + globally add necessary meta props
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      if (isDev) $util.info('user | update | dirty', dirty)

      // persist anonymous/object to firestore
      await $fire.firestore
        .collection(COLLECTION)
        .doc(docId)
        .update({ ...dirty })

      // Proper: fetch data from server
      // Fallback: commit directly (losing server info, but can afford slight inaccuracy)
      commit('SET', { ...payload, updated: Timestamp.fromDate(new Date()) })
    } catch (error) {
      if (isDev) $util.error('user | update | error', error)
      throw error
    }
  },

  async get({ commit }, { firebaseId }) {
    const { $fire, $util, isDev } = this.app.context
    try {
      // expect unique record with firebase id
      const snapshot = await $fire.firestore
        .collection(COLLECTION)
        .where('firebaseId', '==', firebaseId)
        .limit(1)
        .get()

      const doc = snapshot.docs[0]
      const { id, exists, metadata } = doc
      if (isDev) $util.info('user | get | id, exists, metadata', id, exists, metadata)

      // put all the information together into an object before goes to state
      const user = { ...doc.data(), id }
      if (isDev) $util.info('user | get | user', user)
      commit('SET', user)

      return user
    } catch (error) {
      if (isDev) $util.error('user | get | error', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
