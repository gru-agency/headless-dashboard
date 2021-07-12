import * as consola from 'consola'
import { Timestamp } from '~/plugins/firebase'

const state = () => ({
  currentUser: null,
})

const getters = {
  authenticated: () => !!state.currentUser,
}

const mutations = {
  SET: (state, { authUser }) => {
    if (authUser) {
      const { uid, email, emailVerified, phoneNumber, metadata } = authUser
      state.currentUser = {
        email,
        emailVerified,
        phoneNumber,
        firebaseId: uid,
        created: metadata?.creationTime,
        lastSignIn: metadata?.lastSignInTime,
      }
    } else {
      state.currentUser = null
    }
  },

  UNSET_USER: (state) => (state.currentUser = null),
}

const actions = {
  onAuthStateChanged({ commit }, user) {
    try {
      if (this.app.context.isDev) consola.info('onAuthStateChanged | user', user)
      commit('SET', user)
    } catch (error) {
      if (this.app.context.isDev) consola.error('onAuthStateChanged | error', error)
    }
  },

  async registerWithEmailAndPassword({ commit, dispatch, state }, { email, password, name, emailConsent }) {
    try {
      const { user } = await this.$fire.auth.createUserWithEmailAndPassword(email, password)
      if (this.app.context.isDev) consola.info('registerWithEmailAndPassword | user', user)
      commit('SET', { authUser: user })

      const { created, lastSignIn } = state.currentUser
      await dispatch(
        'user/add',
        {
          ...state.currentUser,
          created: Timestamp.fromMillis(Date.parse(created)),
          lastSignIn: Timestamp.fromMillis(Date.parse(lastSignIn)),
          displayName: name,
          emailConsent,
        },
        { root: true }
      )
      await dispatch('requestEmailVerification')

      if (this.app.context.isDev) consola.info('registerWithEmailAndPassword', 'Successful')
      return new Promise((resolve, reject) => resolve(state.currentUser))
    } catch (error) {
      if (this.app.context.isDev) consola.error('registerWithEmailAndPassword | error', error)
      return new Promise((resolve, reject) => reject(error))
    }
  },

  async signInWithEmailAndPassword({ commit }, { email, password }) {
    await this.$fire.auth
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        if (this.app.context.isDev) consola.info('signInWithEmailAndPassword | user', user)
        commit('SET', { authUser: user })
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        // auth/invalid-email -> rely on client validation
        // auth/user-disabled (e.g. acc locked) -> show & suggest
        // auth/user-not-found -> dont let requestor knows
        // auth/wrong-password -> retry
        if (this.app.context.isDev) consola.error('signInWithEmailAndPassword | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async signOut({ commit }) {
    await this.$fire.auth
      .signOut()
      .then(() => {
        commit('SET', null)
        if (this.app.context.isDev) consola.info('signOut', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('signOut | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async reauthenticateWithCredential({ commit }, { email, password }) {
    if (!this.$fire.auth.currentUser) {
      throw new Error('auth/required-signin', 'Required sign in again')
    }

    const cred = this.$fire.auth.EmailAuthProvider.credential(email, password)
    await this.$fire.auth.currentUser
      .reauthenticateWithCredential(cred)
      .then(({ user }) => {
        if (this.app.context.isDev) consola.info('reauthenticateWithCredential', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('reauthenticateWithCredential | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async updatePassword({ commit }, { newPassword }) {
    await this.$fire.auth.currentUser
      .updatePassword(newPassword)
      .then(() => {
        if (this.app.context.isDev) consola.info('updatePassword', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        // auth/weak-password (< 6 chars) -> rely on client validation
        // auth/requires-recent-login -> prompt login first
        if (this.app.context.isDev) consola.error('updatePassword | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async requestEmailVerification({ commit }) {
    this.$fire.auth.languageCode = this.$i18n.locale
    await this.$fire.auth.currentUser
      .sendEmailVerification()
      .then(() => {
        if (this.app.context.isDev) consola.info('requestEmailVerification', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('requestEmailVerification | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async confirmEmail({ commit }, { code }) {
    await this.$fire.auth
      .applyActionCode(code)
      .then(() => {
        commit('SET', { authUser: this.$fire.auth.currentUser })
        if (this.app.context.isDev) consola.info('confirmEmail', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('confirmEmail | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },

  async requestPasswordReset({ commit }, { email }) {
    try {
      this.$fire.auth.languageCode = this.$i18n.locale
      await this.$fire.auth.sendPasswordResetEmail(email)
      if (this.app.context.isDev) consola.info('requestPasswordReset', 'Successful')
      return new Promise((resolve, reject) => resolve())
    } catch (error) {
      if (this.app.context.isDev) consola.error('requestPasswordReset | error', error)
      return new Promise((resolve, reject) => reject(error))
    }
  },

  async confirmPasswordReset({ commit }, { code, newPassword }) {
    await this.$fire.auth
      .confirmPasswordReset(code, newPassword)
      .then(() => {
        if (this.app.context.isDev) consola.info('confirmPasswordReset', 'Successful')
        return new Promise((resolve, reject) => resolve())
      })
      .catch((error) => {
        if (this.app.context.isDev) consola.error('confirmPasswordReset | error', error)
        return new Promise((resolve, reject) => reject(error))
      })
  },
}

export default { state, getters, actions, mutations }
