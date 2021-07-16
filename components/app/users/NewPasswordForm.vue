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

    <b-form-group v-if="showError" class="mb-3">
      <span class="text-danger"><icon preset="bv-error"></icon> {{ server.message }}</span>
    </b-form-group>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NewPasswordForm',

  props: { size: { type: String, default: undefined } },

  data() {
    return {
      events: {
        validate: 'password-validate',
        validated: 'password-validated',
        submit: 'password-submit',
        submitted: 'password-submitted',
        reset: 'password-reset',
        resetted: 'password-resetted',
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
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.validate)
    this.$nuxt.$off(this.events.submit)
    this.$nuxt.$off(this.events.reset)
  },

  methods: {
    ...mapActions('auth', ['confirmPasswordReset']),

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
      this.confirmPasswordReset(this.form).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
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

    /** [START] password-related methods */
    onPasswordToggle() {
      this.password.type = this.password.type === 'text' ? 'password' : 'text'
    },
    /** [END] password-related methods */
  },
}
</script>
