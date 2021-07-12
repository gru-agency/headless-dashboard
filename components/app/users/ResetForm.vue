<template>
  <validation-observer ref="resetForm">
    <b-form-group :label="ui.email" label-for="rst-email">
      <validation-provider v-slot="vp" :name="ui.email" rules="required|email|max:320">
        <b-form-input
          id="rst-email"
          v-model="form.email"
          :state="$vee.checkState(vp) && checkServerState('email')"
          autocomplete="email"
          type="email"
          size="lg"
          trim
        ></b-form-input>
        <b-form-invalid-feedback>
          <span v-if="vp.errors.length > 0">
            <icon preset="bv-error"></icon> {{ vp.errors[0] }}
          </span>
          <span v-if="serverError.validated">
            <icon preset="bv-error"></icon> {{ serverError.message }}
          </span>
        </b-form-invalid-feedback>
      </validation-provider>
    </b-form-group>

    <toast id="rst-toast" class="py-3" :preset="toastPreset" is-static no-auto-hide>
      {{ serverError.message }}
    </toast>
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

  computed: {
    toastPreset() {
      return this.serverError.valid ? 'success' : 'error'
    },
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
      this.serverError.validated = true
      if (error.code) {
        if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
          this.serverError.field = 'email'
          this.serverError.message = this.$t('validation.emailInvalid')
        } else {
          this.serverError.field = null
          this.serverError.message = this.$t('general.error5xx')
          this.$bvToast.show('rst-toast')
        }
      }
    },

    successHandler() {
      this.resetForm()
      this.$emit(this.events.submitted, true)
    },

    async submitForm() {
      const valid = await this.validateForm()
      if (!valid) {
        this.$emit(this.events.submitted, valid)
        return
      }

      await this.requestPasswordReset(this.form)
        .then(() => this.successHandler())
        .catch((error) => this.errorHandler(error))
    },

    async validateForm() {
      const valid = await this.$refs.resetForm.validate().then()
      this.$emit(this.events.validated, valid)
      return valid
    },

    resetForm() {
      this.serverError = { validated: false, valid: false, field: null, code: null, message: null }
      this.form.email = null
      this.$nextTick(() => this.$refs.resetForm?.reset())
    },

    checkServerState(field) {
      return this.serverError.validated
        ? field === this.serverError.field
          ? this.serverError.valid
          : null
        : null
    },
  },
}
</script>
