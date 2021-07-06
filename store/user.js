import * as consola from 'consola'

const state = () => ({
  me: null,
})

const getters = {}

const mutations = {
  SET_ME: (state, user) => {
    if (user) {
      const { uid, email, emailVerified, displayName, phoneNumber, photoURL, metadata } = user
      state.me = {
        email,
        emailVerified,
        displayName,
        phoneNumber,
        firebaseId: uid,
        photoUrl: photoURL,
        creationTime: metadata.creationTime,
        lastSignInTime: metadata.lastSignInTime,
      }
    } else {
      state.me = null
    }
  },
}

const actions = {
  async requestPasswordReset({ email }) {
    try {
      this.$fire.auth.languageCode = this.$i18n.locale
      await this.$fire.auth.sendPasswordResetEmail(email)
    } catch (error) {
      // auth/invalid-email -> rely on client validation
      // auth/user-not-found -> dont let requestor knows
      // the rest (incl. developer errors) -> retry
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async confirmPasswordReset({ code, newPassword }) {
    try {
      await this.$fire.auth.confirmPasswordReset(code, newPassword)
    } catch (error) {
      // auth/expired-action-code -> show & suggest
      // auth/invalid-action-code -> show & suggest
      // auth/user-disabled (e.g. acc locked) -> show & suggest
      // auth/user-not-found -> dont let requestor knows
      // auth/weak-password (< 6 chars) -> rely on client validation
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async signInWithEmailAndPassword({ commit }, { email, password }) {
    try {
      const user = await this.$fire.auth.signInWithEmailAndPassword(email, password)
      commit('SET_ME', user)
    } catch (error) {
      // auth/invalid-email -> rely on client validation
      // auth/user-disabled (e.g. acc locked) -> show & suggest
      // auth/user-not-found -> dont let requestor knows
      // auth/wrong-password -> retry
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async registerWithEmailAndPassword({ commit }, { email, password }) {
    try {
      const user = await this.$fire.auth.createUserWithEmailAndPassword(email, password)
      commit('SET_ME', user)
    } catch (error) {
      // auth/email-already-in-use -> retry
      // auth/invalid-email -> rely on client validation
      // auth/operation-not-allowed -> dev error
      // auth/weak-password (< 6 chars) -> rely on client validation
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async signOut({ commit }) {
    try {
      await this.$fire.auth.signOut()
      commit('SET_ME', null)
    } catch (error) {
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async updatePassword({ newPassword }) {
    try {
      const user = this.$fire.auth.currentUser
      await user.updatePassword(newPassword)
    } catch (error) {
      // auth/weak-password (< 6 chars) -> rely on client validation
      // auth/requires-recent-login -> prompt login first
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async requestEmailVerification() {
    try {
      const user = this.$fire.auth.currentUser
      await user.sendEmailVerification()
    } catch (error) {
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  async confirmEmail({ commit }, { code }) {
    try {
      await this.$fire.auth.applyActionCode(code)
      const user = this.$fire.auth.currentUser
      commit('SET_ME', user)
    } catch (error) {
      // auth/expired-action-code -> show & suggest
      // auth/invalid-action-code -> show & suggest
      // auth/user-disabled (e.g. acc locked) -> show & suggest
      // auth/user-not-found -> dont let requestor knows
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },

  onAuthStateChanged({ commit }, { user }) {
    try {
      user ? commit('SET_ME', user) : commit('SET_ME', null)
    } catch (error) {
      if (this.$context.isDev) consola.error(error)
      return error
    }
  },
}

export default { state, getters, actions, mutations }
