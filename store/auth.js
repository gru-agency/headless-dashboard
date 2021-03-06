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
      $log.tag('auth').debug('[onAuthStateChanged] user=%o', user)
      if (user.authUser) {
        commit('SET', user)
      } else {
        commit('UNSET')
      }

      if (user.claims) {
        await dispatch('user_sessions/add', user.claims, { root: true })
      } else {
        await dispatch('user_sessions/clear', null, { root: true })
      }
    } catch (error) {
      $log.tag('auth').error('[onAuthStateChanged]', error)
    }
  },

  async registerWithEmailAndPassword({ commit, dispatch, state }, { email, password, name, emailConsent }) {
    const { $fire, $log } = this.app.context
    try {
      // create user with email/password method
      const { user } = await $fire.auth.createUserWithEmailAndPassword(email, password)
      $log.tag('auth').debug('[registerWithEmailAndPassword] User created %o', user)
      commit('SET', { authUser: user })

      // keep a copy of user in firestore optimistically
      const payload = { ...state.authUser, displayName: name, emailConsent }
      await dispatch('user/create', { payload }, { root: true })

      // automatically send email verification upon successful registration
      // though can be requested manually at later time
      await dispatch('requestEmailVerification')

      $log.tag('auth').success('[registerWithEmailAndPassword]')
    } catch (error) {
      // auth/email-already-in-use
      // auth/invalid-email
      // auth/operation-not-allowed (email/password accounts are not enabled) -- log
      // auth/weak-password
      $log.tag('auth').error('[registerWithEmailAndPassword]', error)
      throw error
    }
  },

  async loginWithEmailAndPassword({ commit, dispatch }, { email, password, persist }) {
    const { $fire, $log } = this.app.context
    const persistence = persist ? 'local' : 'session'
    try {
      await $fire.auth.setPersistence(persistence)
      const { user } = await $fire.auth.signInWithEmailAndPassword(email, password)
      $log.tag('auth').debug('[loginWithEmailAndPassword] User found %o', user)
      commit('SET', { authUser: user })

      // immediately fetch user from store
      await dispatch('user/retrieveByFirebaseId', { firebaseId: user.uid }, { root: true })

      $log.tag('auth').success('[loginWithEmailAndPassword]')
    } catch (error) {
      // auth/invalid-email
      // auth/user-disabled
      // auth/user-not-found
      // auth/wrong-password
      $log.tag('auth').error('[loginWithEmailAndPassword]', error)
      throw error
    }
  },

  async signOut({ commit }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.signOut()
      commit('UNSET')
      $log.tag('auth').success('[signout]')
    } catch (error) {
      $log.tag('auth').error('[signout]', error)
      throw error
    }
  },

  async reauthenticateWithCredential({ _ }, { email, password }) {
    const { $fire, $fireModule, $log } = this.app.context
    const cred = $fireModule.auth.EmailAuthProvider.credential(email, password)
    try {
      await $fire.auth.currentUser.reauthenticateWithCredential(cred)
      $log.tag('auth').success('[reauthenticateWithCredential]')
    } catch (error) {
      // auth/user-mismatch -- log
      // auth/user-not-found -- log
      // auth/invalid-credential -- log
      // auth/invalid-email -- log
      // auth/wrong-password
      // auth/invalid-verification-code (for phone auth)
      // auth/invalid-verification-id (for phone auth)
      $log.tag('auth').error('[reauthenticateWithCredential]', error)
      throw error
    }
  },

  async updatePassword({ _ }, { newPassword }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.currentUser.updatePassword(newPassword)
      $log.tag('auth').success('[updatePassword]')
    } catch (error) {
      // auth/weak-password (less than 6 chars)
      // auth/requires-recent-login
      $log.tag('auth').error('[updatePassword]', error)
      throw error
    }
  },

  async requestEmailVerification({ _ }) {
    const { $fire, $log, i18n } = this.app.context
    $fire.auth.languageCode = i18n.locale
    try {
      await $fire.auth.currentUser.sendEmailVerification()
      $log.tag('auth').success('[requestEmailVerification]')
    } catch (error) {
      $log.tag('auth').error('[requestEmailVerification]', error)
      throw error
    }
  },

  async confirmEmail({ commit }, { code }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.applyActionCode(code)
      commit('SET', { authUser: $fire.auth.currentUser })
      $log.tag('auth').success('[confirmEmail]')
    } catch (error) {
      // auth/expired-action-code
      // auth/invalid-action-code
      // auth/user-disabled
      // auth/user-not-found -- log
      $log.tag('auth').error('[confirmEmail]', error)
      throw error
    }
  },

  async requestPasswordReset({ _ }, { email }) {
    const { $fire, $log, $i18n } = this.app.context
    $fire.auth.languageCode = $i18n.locale
    try {
      await $fire.auth.sendPasswordResetEmail(email)
      $log.tag('auth').success('[requestPasswordReset]')
    } catch (error) {
      // auth/invalid-email
      // auth/user-not-found
      $log.tag('auth').error('[requestPasswordReset]', error)
      throw error
    }
  },

  async confirmPasswordReset({ _ }, { code, newPassword }) {
    const { $fire, $log } = this.app.context
    try {
      await $fire.auth.confirmPasswordReset(code, newPassword)
      $log.tag('auth').success('[confirmPasswordReset]')
    } catch (error) {
      // auth/expired-action-code
      // auth/invalid-action-code
      // auth/user-disabled
      // auth/user-not-found -- log
      // auth/weak-password
      $log.tag('auth').error('[confirmPasswordReset]', error)
      throw error
    }
  },
}

export default { state, getters, actions, mutations }
