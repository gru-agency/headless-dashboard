<template>
  <validation-observer ref="resetForm" slim>
    <validation-provider v-slot="vp" :name="ui.email" slim rules="required|email|max:320">
      <b-form-group :label="ui.email" label-for="rst-email">
        <b-form-input
          id="rst-email"
          v-model="form.email"
          :state="$utils.evaluateState($vee.state(vp), $val.state(serverError, 'email'))"
          autocomplete="email"
          type="email"
          size="lg"
          trim
        ></b-form-input>
        <b-form-invalid-feedback>
          <span><icon preset="bv-error"></icon> {{ $vee.error(vp) || $val.error(serverError) }}</span>
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ResetForm',

  data() {
    return {
      events: {
        validate: 'reset-validate',
        validated: 'reset-validated',
        submit: 'reset-submit',
        submitted: 'reset-submitted',
        reset: 'reset-reset',
        resetted: 'reset-resetted',
      },
      ui: { email: this.$t('general.email') },
      form: { email: null },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
    }
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
    ...mapActions('auth', ['requestPasswordReset']),

    errorHandler(error) {
      this.serverError = {
        ...this.serverError,
        validated: true,
        valid: false,
        code: error.code,
        message: error.message,
      }

      // determine field error and propagate non-field error to parent
      // Note: 'auth/user-not-found' intentionally put a different meesage
      // to obfuscate the fact in order to prevent malicious attempts
      if (['auth/invalid-email', 'auth/user-not-found'].includes(error.code)) {
        this.serverError = {
          ...this.serverError,
          field: 'email',
          message: this.$t('validation.emailInvalid'),
        }
      }

      if (!this.serverError.field) {
        this.$emit(this.events.submitted, false, this.serverError)
      }
    },

    successHandler(response) {
      this.serverError = { ...this.serverError, validated: true, valid: true }
      this.$emit(this.events.submitted, true, null, response)
    },

    async submitForm() {
      const valid = this.validateForm()
      if (!valid) return

      await this.requestPasswordReset(this.form)
        .then((response) => this.successHandler(response))
        .catch((error) => this.errorHandler(error))
    },

    validateForm() {
      const valid = this.$refs.resetForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },
  },
}
</script>
