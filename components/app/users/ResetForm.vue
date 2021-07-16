<template>
  <validation-observer ref="resetForm" slim>
    <validation-provider v-slot="vp" :name="ui.email" slim rules="required|email|max:320">
      <b-form-group :label="ui.email" label-for="rst-email">
        <b-form-input
          id="rst-email"
          v-model="form.email"
          :state="$val.evalState($vee.state(vp), $val.state(server, 'email'))"
          autocomplete="email"
          type="email"
          size="lg"
          trim
          autofocus
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
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
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
      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: error.message,
      }

      // determine field/form error and propagate the rest to parent
      if (['auth/invalid-email', 'auth/user-not-found'].includes(error.code)) {
        this.server = {
          ...this.server,
          message: this.$t('validation.accountNotFound'),
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
      this.requestPasswordReset(this.form).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    validateForm() {
      const valid = this.$refs.resetForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async resetForm() {
      this.resetFormState()
      this.$refs.resetForm?.reset()
      await this.$nextTick()
      this.$emit(this.events.resetted)
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },
  },
}
</script>
