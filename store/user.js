import * as consola from 'consola'
import { nanoid } from 'nanoid'
import { FieldValue, Timestamp } from '~/plugins/firebase'

const COLLECTION = 'users'

const state = () => ({
  user: null,
})

const getters = {}

const mutations = {
  // SET: (state, data) => (state.user = { ...data, object: 'user' }),
  SET: (state, payload) => {
    payload.object = 'user'
    state.user = payload
  },
}

const actions = {
  async add({ commit }, docId, payload) {
    try {
      docId = docId || nanoid()

      // remove local props + globally add necessary meta props
      const { ...dirty } = { ...payload, created: FieldValue.serverTimestamp() }
      if (this.app.context.isDev) consola.info('user | add | id, dirty', docId, dirty)

      // persist anonymous/object to firestore
      await this.$fire.firestore
        .collection(COLLECTION)
        .doc(docId)
        .set({ ...dirty })

      // Proper: fetch data from server
      // Fallback: commit directly (losing server info, but can afford slight inaccuracy)
      commit('SET', { ...payload, id: docId, created: Timestamp.fromDate(new Date()) })
    } catch (error) {
      if (this.app.context.isDev) consola.error('user | add | error', error)
      return error
    }
  },

  async update({ commit }, docId, payload) {
    try {
      // remove local props + globally add necessary meta props
      const { id, object, ...dirty } = { ...payload, updated: FieldValue.serverTimestamp() }
      if (this.app.context.isDev) consola.info('user | update | dirty', dirty)

      // persist anonymous/object to firestore
      await this.$fire.firestore
        .collection(COLLECTION)
        .doc(docId)
        .update({ ...dirty })

      // Proper: fetch data from server
      // Fallback: commit directly (losing server info, but can afford slight inaccuracy)
      commit('SET', { ...payload, updated: Timestamp.fromDate(new Date()) })
    } catch (error) {
      if (this.app.context.isDev) consola.error('user | update | error', error)
      return error
    }
  },

  async get({ commit, state }, { firebaseId }) {
    try {
      // expect unique record with firebase id
      const snapshot = await this.$fire.firestore
        .collection(COLLECTION)
        .where('firebaseId', '==', firebaseId)
        .limit(1)
        .get()

      const doc = snapshot.docs[0]
      const { id, exists, metadata } = doc
      if (this.app.context.isDev) {
        consola.info('user | get | id, exists, metadata', id, exists, metadata)
      }

      // put all the information together into an object before goes to state
      const user = { ...doc.data(), id }
      if (this.app.context.isDev) consola.info('user | get | user', user)
      commit('SET', user)

      return user
    } catch (error) {
      if (this.app.context.isDev) consola.error('user | get | error', error)
      return error
    }
  },
}

export default { state, getters, actions, mutations }
