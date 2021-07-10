import * as consola from 'consola'
import { FieldValue } from '~/plugins/firebase'

const COLLECTION = 'users'

const state = () => ({
  user: null,
})

const getters = {}

const mutations = {
  SET: (state, payload) => (state.user = { ...payload }),
}

const actions = {
  async add({ commit }, payload) {
    payload = { ...payload, object: 'user' }

    await this.$fire.firestore
      .collection(COLLECTION)
      .add(payload)
      .then((doc) => {
        if (this.app.context.isDev) consola.info('user.js | add | doc', doc)
        commit('SET', payload)
        if (this.app.context.isDev) consola.info('user.js | add', 'Successful')
        return new Promise((resolve, reject) => resolve(payload))
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('user.js | add | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async update({ commit }, docId, payload) {
    payload = {
      ...payload,
      updated: FieldValue.serverTimestamp(),
    }

    await this.$fire.firestore
      .collection(COLLECTION)
      .doc(docId)
      .update(payload)
      .then(() => {
        commit('SET', payload)
        if (this.app.context.isDev) consola.info('user.js | update', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('user.js | update | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async get({ commit }, firebaseId) {
    await this.$fire.firestore
      .collection(COLLECTION)
      .where('firebaseId', '==', firebaseId)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (this.app.context.isDev) consola.info('user.js | get| snapshot', snapshot)
        const doc = snapshot[0] // expecting one record ONLY
        commit('SET', { payload: doc })
        if (this.app.context.isDev) consola.info('user.js | get', 'Successful')
        return new Promise((resolve, reject) => resolve(doc?.data))
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('user.js | get | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },
}

export default { state, getters, actions, mutations }
