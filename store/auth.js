import * as consola from 'consola'

const state = () => ({
  authUser: null,
})

const getters = {
  authenticated: () => !!state.authUser,
}

const mutations = {
  SET: (state, { authUser }) => {
    if (authUser) {
      const { uid, email, emailVerified, phoneNumber, metadata } = authUser
      state.authUser = {
        email,
        emailVerified,
        phoneNumber,
        firebaseId: uid,
        created: metadata?.creationTime,
        lastSignIn: metadata?.lastSignInTime,
      }
    } else {
      state.authUser = null
    }
  },

  UNSET: (state) => (state.authUser = null),
}

const actions = {
  onAuthStateChanged({ commit }, user) {
    const { isDev } = this.app.context
    try {
      if (isDev) consola.info('auth | onAuthStateChanged | user', user)
      commit('SET', user)
    } catch (error) {
      if (isDev) consola.error('auth | onAuthStateChanged | error', error)
    }
  },

  async registerWithEmailAndPassword({ commit, dispatch, state }, { email, password, name, emailConsent }) {
    const { $fire, isDev } = this.app.context
    try {
      // create user with email/password method
      const { user } = await $fire.auth.createUserWithEmailAndPassword(email, password)
      if (isDev) consola.info('auth | registerWithEmailAndPassword | authUser', user)
      commit('SET', { authUser: user })

      // keep a copy of user in firestore optimistically
      const payload = { ...state.authUser, displayName: name, emailConsent }
      await dispatch('user/add', { payload }, { root: true })

      // automatically send email verification upon successful registration
      // though can be requested manually at later time
      await dispatch('requestEmailVerification')

      if (isDev) consola.info('auth | registerWithEmailAndPassword', 'successful')
    } catch (error) {
      // auth/email-already-in-use
      // auth/invalid-email
      // auth/operation-not-allowed (email/password accounts are not enabled) -- log
      // auth/weak-password
      if (isDev) consola.error('auth | registerWithEmailAndPassword | error', error)
      throw error
    }
  },

  async signInWithEmailAndPassword({ commit }, { email, password, persist }) {
    const { $fire, isDev } = this.app.context
    const persistence = persist ? 'local' : 'session'
    try {
      await $fire.auth.setPersistence(persistence)
      const { user } = await $fire.auth.signInWithEmailAndPassword(email, password)
      if (isDev) consola.info('auth | signInWithEmailAndPassword | authUser', user)
      commit('SET', { authUser: user })

      if (isDev) consola.info('auth | signInWithEmailAndPassword', 'successful')
    } catch (error) {
      // auth/invalid-email
      // auth/user-disabled
      // auth/user-not-found
      // auth/wrong-password
      if (isDev) consola.error('auth | signInWithEmailAndPassword | error', error)
      throw error
    }
  },

  async signOut({ commit }) {
    const { $fire, isDev } = this.app.context
    try {
      await $fire.auth.signOut()
      commit('UNSET')
      if (isDev) consola.info('auth | signOut', 'successful')
    } catch (error) {
      if (isDev) consola.error('auth | signOut | error', error)
      throw error
    }
  },

  async reauthenticateWithCredential({ _ }, { email, password }) {
    const { $fire, isDev } = this.app.context
    const cred = $fire.auth.EmailAuthProvider.credential(email, password)
    try {
      await $fire.auth.currentUser.reauthenticateWithCredential(cred)
      if (isDev) consola.info('auth | reauthenticateWithCredential', 'successful')
    } catch (error) {
      // auth/user-mismatch
      // auth/user-not-found
      // auth/invalid-credential
      // auth/invalid-email
      // auth/wrong-password
      // auth/invalid-verification-code (for phone auth)
      // auth/invalid-verification-id (for phone auth)
      if (isDev) consola.error('auth | reauthenticateWithCredential | error', error)
      throw error
    }
  },

  async updatePassword({ _ }, { newPassword }) {
    const { $fire, isDev } = this.app.context
    try {
      await $fire.auth.currentUser.updatePassword(newPassword)
      if (isDev) consola.info('auth | updatePassword', 'successful')
    } catch (error) {
      // auth/weak-password (less than 6 chars)
      // auth/requires-recent-login
      if (isDev) consola.error('auth | updatePassword | error', error)
      throw error
    }
  },

  async requestEmailVerification({ _ }) {
    const { $fire, isDev } = this.app.context
    $fire.auth.languageCode = this.$i18n.locale
    try {
      await $fire.auth.currentUser.sendEmailVerification()
      if (isDev) consola.info('auth | requestEmailVerification', 'successful')
    } catch (error) {
      if (isDev) consola.error('auth | requestEmailVerification | error', error)
      throw error
    }
  },

  async confirmEmail({ commit }, { code }) {
    const { $fire, isDev } = this.app.context
    try {
      await $fire.auth.applyActionCode(code)
      commit('SET', { authUser: $fire.auth.currentUser })
      if (isDev) consola.info('auth | confirmEmail', 'successful')
    } catch (error) {
      // auth/expired-action-code
      // auth/invalid-action-code
      // auth/user-disabled
      // auth/user-not-found -- log
      if (isDev) consola.error('auth | confirmEmail | error', error)
      throw error
    }
  },

  async requestPasswordReset({ _ }, { email }) {
    const { $fire, isDev, i18n } = this.app.context
    $fire.auth.languageCode = i18n.locale
    try {
      await $fire.auth.sendPasswordResetEmail(email)
      if (isDev) consola.info('auth | requestPasswordReset', 'successful')
    } catch (error) {
      // auth/invalid-email
      // auth/user-not-found
      if (isDev) consola.error('auth | requestPasswordReset | error', error)
      throw error
    }
  },

  async confirmPasswordReset({ _ }, { code, newPassword }) {
    const { $fire, isDev } = this.app.context
    try {
      await $fire.auth.confirmPasswordReset(code, newPassword)
      if (isDev) consola.info('auth | confirmPasswordReset', 'successful')
    } catch (error) {
      // auth/expired-action-code
      // auth/invalid-action-code
      // auth/user-disabled
      // auth/user-not-found -- log
      // auth/weak-password
      if (isDev) consola.error('auth | confirmPasswordReset | error', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
