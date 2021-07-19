<template>
  <validation-observer ref="newPasswordForm" v-slot="vo" tag="form">
    <vee-broadcaster :states="vo" @states="onFormStateChanged"></vee-broadcaster>

    <validation-provider v-slot="vp" :name="ui.newPassword" slim mode="aggressive" rules="hint_pw:10|max:128">
      <b-form-group :label="ui.newPassword" label-for="new-password" class="position-relative">
        <tips-field
          v-if="form.newPassword"
          :preset="passwordRevealable ? 'bv-eye-slash' : 'bv-eye'"
          :class="size"
          class="input-inset right"
          tooltip
          @click="onPasswordToggle()"
        >
          {{ passwordRevealable ? password.hideText : password.showText }}
        </tips-field>
        <b-form-input
          id="new-password"
          v-model="form.newPassword"
          :state="$val.evalState($vee.state(vp), $val.state(server, 'password'))"
          autocomplete="new-password"
          :type="password.type"
          :size="size"
          trim
          @blur="password.focus = false"
          @focus="password.focus = true"
        ></b-form-input>
        <b-form-invalid-feedback>
          <span><icon preset="bv-error"></icon> {{ $vee.error(vp) || $val.error(server) }}</span>
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <b-alert :show="showError" variant="danger">
      <icon preset="bv-error" class="mr-2"></icon> {{ server.message }}
    </b-alert>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NewPasswordForm',

  props: {
    size: { type: String, default: undefined },
    intent: { type: String, default: 'reset' },
  },

  data() {
    return {
      events: {
        validate: 'password-validate',
        validated: 'password-validated',
        submit: 'password-submit',
        submitted: 'password-submitted',
        reset: 'password-reset',
        resetted: 'password-resetted',
        reauth: {
          success: 'reauth-success',
          cancel: 'reauth-cancel',
          error: 'reauth-error',
        },
      },
      ui: { newPassword: this.$t('general.newPassword') },
      password: {
        type: 'password',
        focus: false,
        hideText: this.$t('general.hidePassword'),
        showText: this.$t('general.showPassword'),
      },
      form: { code: this.$route.query.oobCode, newPassword: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },

    forReset() {
      return this.intent === 'reset'
    },

    forChange() {
      return this.intent === 'change'
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
    this.$nuxt.$on(this.events.reauth.cancel, this.onReAuthCancel)
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.validate)
    this.$nuxt.$off(this.events.submit)
    this.$nuxt.$off(this.events.reset)
    this.$nuxt.$on(this.events.reauth.cancel)
  },

  methods: {
    ...mapActions('auth', ['confirmPasswordReset', 'updatePassword']),

    errorHandler(error) {
      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: error.message,
      }

      // determine field/form error and propagate the rest to parent
      if (error.code === 'auth/weak-password') {
        this.server = {
          ...this.server,
          field: 'password',
          message: this.$t('validation.passwordInvalid'),
        }
      } else if (error.code === 'auth/requires-recent-login') {
        // intentionally hide the error message
        this.server = { ...this.server, validated: false, message: null }
        this.$nextTick(() => this.$bvModal.show('reauth-modal'))
      } else if (error.code === 'auth/cancel-reauthentication') {
        this.server = {
          ...this.server,
          message: this.$t('validation.reauthenticationRequired'),
        }
      } else {
        this.server = {
          ...this.server,
          message: this.$t('general.error5xx'),
        }
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
      if (this.forReset) {
        this.confirmPasswordReset(this.form).then(
          (response) => this.successHandler(response),
          (error) => this.errorHandler(error)
        )
      } else {
        this.updatePassword(this.form).then(
          (response) => this.successHandler(response),
          (error) => this.errorHandler(error)
        )
      }
    },

    validateForm() {
      const valid = this.$refs.newPasswordForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async resetForm() {
      this.resetFormState()
      this.$refs.newPasswordForm?.reset()
      await this.$nextTick()
      this.$emit(this.events.resetted)
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },

    onFormStateChanged(states) {
      if (states.validated) this.$emit(this.events.validated, !states.invalid)
    },

    onReAuthCancel() {
      this.errorHandler({ code: 'auth/cancel-reauthentication' })
    },

    /** [START] password-related methods */
    onPasswordToggle() {
      this.password.type = this.password.type === 'text' ? 'password' : 'text'
    },
    /** [END] password-related methods */
  },
}
</script>
