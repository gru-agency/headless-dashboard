const state = () => ({
  authUser: null,
})

const getters = {
  authenticated: () => !!state.authUser,
}

const mutations = {
  SET: (state, { authUser, claims }) => {
    const { uid, email, emailVerified, phoneNumber, metadata } = authUser
    state.authUser = {
      email,
      emailVerified,
      phoneNumber,
      firebaseId: uid,
      created: metadata?.creationTime,
      lastLogin: claims?.auth_time,
      tokenExpired: claims?.exp,
    }
  },

  UNSET: (state) => (state.authUser = null),
}

const actions = {
  async onAuthStateChanged({ commit, dispatch }, user) {
    const { $log } = this.app.context
    try {
      $log.debug('auth | onAuthStateChanged | user', user)
      if (user.authUser) {
        commit('SET', user)
      } else {
        commit('UNSET')
      }

      if (user.claims) {
        await dispatch('user_session/add', user.claims, { root: true })
      } else {
        await dispatch('user_session/clear', null, { root: true })
      }
    } catch (error) {
      $log.error('auth | onAuthStateChanged | error', error)
    }
  },

  async registerWithEmailAndPassword({ commit, dispatch, state }, { email, password, name, emailConsent }) {
    const { $fire, $log } = this.app.context
    try {
      // create user with email/password method
      const { user } = await $fire.auth.createUserWithEmailAndPassword(email, password)
      $log.debug('auth | registerWithEmailAndPassword | authUser', user)
      commit('SET', { authUser: user })

      // keep a copy of user in firestore optimistically
      const payload = { ...state.authUser, displayName: name, emailConsent }
      await dispatch('user/add', { payload }, { root: true })

      // automatically send email verification upon successful registration
      // though can be requested manually at later time
      await dispatch('requestEmailVerification')

      $log.success('auth | registerWithEmailAndPassword', 'successful')
    } catch (error) {
      // auth/email-already-in-use
      // auth/invalid-email
      // auth/operation-not-allowed (email/password accounts are not enabled) -- log
      // auth/weak-password
      $log.error('auth | registerWithEmailAndPassword | error', error)
      throw error
    }
  },

  async loginWithEmailAndPassword({ commit }, { email, password, persist }) {
    const { $fire, $log } = this.app.context
    const persistence = persist ? 'local' : 'session'
    try {
      await $fire.auth.setPersistence(persistence)
      const { user } = await $fire.auth.signInWithEmailAndPassword(email, password)
      $log.debug('auth | loginWithEmailAndPassword | authUser', user)
      commit('SET', { authUser: user })

      $log.success('auth | loginWithEmailAndPassword', 'successful')
    } catch (error) {
      // auth/invalid-email
      // auth/user-disabled
      // auth/user-not-found
      // auth/wrong-password
      $log.error('auth | loginWithEmailAndPassword | error', error)
      throw error
    }
  },

  async signOut({ commit }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.signOut()
      commit('UNSET')
      $log.success('auth | signOut', 'successful')
    } catch (error) {
      $log.error('auth | signOut | error', error)
      throw error
    }
  },

  async reauthenticateWithCredential({ _ }, { email, password }) {
    const { $fire, $fireModule, $log } = this.app.context
    const cred = $fireModule.auth.EmailAuthProvider.credential(email, password)
    try {
      await $fire.auth.currentUser.reauthenticateWithCredential(cred)
      $log.success('auth | reauthenticateWithCredential', 'successful')
    } catch (error) {
      // auth/user-mismatch -- log
      // auth/user-not-found -- log
      // auth/invalid-credential -- log
      // auth/invalid-email -- log
      // auth/wrong-password
      // auth/invalid-verification-code (for phone auth)
      // auth/invalid-verification-id (for phone auth)
      $log.error('auth | reauthenticateWithCredential | error', error)
      throw error
    }
  },

  async updatePassword({ _ }, { newPassword }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.currentUser.updatePassword(newPassword)
      $log.success('auth | updatePassword', 'successful')
    } catch (error) {
      // auth/weak-password (less than 6 chars)
      // auth/requires-recent-login
      $log.error('auth | updatePassword | error', error)
      throw error
    }
  },

  async requestEmailVerification({ _ }) {
    const { $fire, $log, i18n } = this.app.context
    $fire.auth.languageCode = i18n.locale
    try {
      await $fire.auth.currentUser.sendEmailVerification()
      $log.success('auth | requestEmailVerification', 'successful')
    } catch (error) {
      $log.error('auth | requestEmailVerification | error', error)
      throw error
    }
  },

  async confirmEmail({ commit }, { code }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.applyActionCode(code)
      commit('SET', { authUser: $fire.auth.currentUser })
      $log.success('auth | confirmEmail', 'successful')
    } catch (error) {
      // auth/expired-action-code
      // auth/invalid-action-code
      // auth/user-disabled
      // auth/user-not-found -- log
      $log.error('auth | confirmEmail | error', error)
      throw error
    }
  },

  async requestPasswordReset({ _ }, { email }) {
    const { $fire, $log, $i18n } = this.app.context
    $fire.auth.languageCode = $i18n.locale
    try {
      await $fire.auth.sendPasswordResetEmail(email)
      $log.success('auth | requestPasswordReset', 'successful')
    } catch (error) {
      // auth/invalid-email
      // auth/user-not-found
      $log.error('auth | requestPasswordReset | error', error)
      throw error
    }
  },

  async confirmPasswordReset({ _ }, { code, newPassword }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.confirmPasswordReset(code, newPassword)
      $log.success('auth | confirmPasswordReset', 'successful')
    } catch (error) {
      // auth/expired-action-code
      // auth/invalid-action-code
      // auth/user-disabled
      // auth/user-not-found -- log
      // auth/weak-password
      $log.error('auth | confirmPasswordReset | error', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
