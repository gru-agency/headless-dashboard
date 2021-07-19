<template>
  <validation-observer ref="loginForm" tag="form">
    <validation-provider v-if="forLogin" v-slot="vp" :name="ui.email" rules="">
      <b-form-group :label="ui.email" label-for="sign-email">
        <b-form-input
          id="sign-email"
          v-model="form.email"
          :state="$val.evalState($vee.state(vp), $val.state(server, 'email'))"
          autocomplete="username email"
          type="email"
          size="lg"
          trim
          autofocus
        ></b-form-input>
        <b-form-invalid-feedback>
          <span> <icon preset="bv-error"></icon> {{ $vee.error(vp) || $val.error(server) }} </span>
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider v-slot="vp" :name="ui.password" slim rules="">
      <b-form-group label-for="sign-password" class="position-relative">
        <template #label>
          {{ ui.password }}
          <action-link
            v-if="forLogin"
            :text="ui.forgot"
            :link="localePath(links.reset)"
            variant="primary"
            class="float-right"
          ></action-link>
        </template>

        <tips-field
          v-if="form.password"
          :preset="passwordRevealable ? 'bv-eye-slash' : 'bv-eye'"
          class="input-inset right lg"
          tooltip
          @click="onPasswordToggle()"
        >
          {{ passwordRevealable ? password.hideText : password.showText }}
        </tips-field>

        <b-form-input
          id="sign-password"
          v-model="form.password"
          :state="$val.evalState($vee.state(vp), $val.state(server, 'password'))"
          autocomplete="current-password"
          :type="password.type"
          size="lg"
          trim
          @blur="password.focus = false"
          @focus="password.focus = true"
        ></b-form-input>
        <b-form-invalid-feedback>
          <span><icon preset="bv-error"></icon> {{ $vee.error(vp) || $val.error(server) }}</span>
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <b-form-group v-if="forLogin" label-for="sign-remember" class="small text-secondary">
      <b-form-checkbox id="sign-remember" v-model="form.persist" size="sm">
        {{ ui.remember }}
      </b-form-checkbox>
    </b-form-group>

    <b-alert :show="showError" variant="danger">
      <icon preset="bv-error" class="mr-2"></icon> {{ server.message }}
    </b-alert>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'LoginForm',

  props: { intent: { type: String, default: 'login' } },

  data() {
    return {
      events: {
        validate: 'login-validate',
        validated: 'login-validated',
        submit: 'login-submit',
        submitted: 'login-submitted',
        reset: 'login-reset',
        resetted: 'login-resetted',
      },
      ui: {
        email: this.$t('general.email'),
        password: this.$t('general.password'),
        forgot: this.$t('modules.users.loginForgotPassword'),
        remember: this.$t('modules.users.loginPersist'),
      },
      links: { reset: { name: 'auth-reset' } },
      password: {
        type: 'password',
        focus: false,
        hideText: this.$t('general.hidePassword'),
        showText: this.$t('general.showPassword'),
      },
      form: { email: null, password: null, persist: false },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    ...mapGetters('auth', ['authenticated']),
    ...mapState('user', ['user']),

    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },

    forLogin() {
      return this.intent === 'login'
    },

    forReAuth() {
      return this.intent === 'reauth'
    },

    /** [START] password-related methods */
    passwordRevealable() {
      return this.password.type === 'text'
    },
    /** [END] password-related methods */
  },

  mounted() {
    this.$nuxt.$on(this.events.validate, this.validateForm)
    this.$nuxt.$on(this.events.submit, this.submitForm)
    this.$nuxt.$on(this.events.reset, this.resetForm)

    // pre-populate email for re-auth
    if (this.forReAuth) this.form.email = this.user.email
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.validate)
    this.$nuxt.$off(this.events.submit)
    this.$nuxt.$off(this.events.reset)
  },

  methods: {
    ...mapActions('auth', ['loginWithEmailAndPassword', 'reauthenticateWithCredential']),

    errorHandler(error) {
      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: error.message,
      }

      // determine field/form error and propagate the rest to parent
      if (error.code === 'auth/invalid-email') {
        this.server = {
          ...this.server,
          field: 'email',
          message: this.$t('validation.emailInvalid'),
        }
      } else if (['auth/user-not-found', 'auth/wrong-password', 'auth/argument-error'].includes(error.code)) {
        this.server = {
          ...this.server,
          message: this.$t('validation.emailPasswordWrong'),
        }
      } else {
        this.$emit(this.events.submitted, false, this.server)
      }
    },

    successHandler(response) {
      this.server = { ...this.server, validated: true, valid: true }
      this.$emit(this.events.submitted, true, null, response)
      this.resetForm()
    },

    submitForm() {
      const valid = this.validateForm()
      if (!valid) return

      this.resetFormState()
      if (this.forLogin) {
        this.loginWithEmailAndPassword(this.form).then(
          (response) => this.successHandler(response),
          (error) => this.errorHandler(error)
        )
      } else {
        this.reauthenticateWithCredential(this.form).then(
          (response) => this.successHandler(response),
          (error) => this.errorHandler(error)
        )
      }
    },

    validateForm() {
      const valid = this.$refs.loginForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async resetForm() {
      this.resetFormState()
      this.$refs.loginForm?.reset()
      await this.$nextTick()
      this.$emit(this.events.resetted)
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },

    /** [START] password-related methods */
    onPasswordToggle() {
      this.password.type = this.password.type === 'text' ? 'password' : 'text'
    },
    /** [END] password-related methods */
  },
}
</script>
