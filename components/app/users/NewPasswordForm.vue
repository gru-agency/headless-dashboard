<template>
  <validation-observer ref="newPasswordForm" v-slot="vo" tag="form">
    <vee-broadcaster :states="vo" @states="onFormStateChanged"></vee-broadcaster>

    <validation-provider v-slot="vp" :name="ui.newPassword" slim mode="aggressive" rules="min:10|max:128">
      <b-form-group :label="ui.newPassword" label-for="new-password" class="position-relative">
        <tips-field
          v-if="form.newPassword"
          :preset="passwordRevealable ? 'bv-eye-slash' : 'bv-eye'"
          :class="size"
          class="input-inset right"
          tooltip
          trim
          @click="onPasswordToggle()"
        >
          {{ passwordRevealable ? password.hideText : password.showText }}
        </tips-field>
        <b-form-input
          id="new-password"
          v-model="form.newPassword"
          :state="$utils.evaluateState($vee.state(vp), $val.state(serverError, 'password'))"
          autocomplete="new-password"
          :type="password.type"
          :size="size"
          trim
          @blur="password.focus = false"
          @focus="password.focus = true"
        ></b-form-input>
        <b-form-invalid-feedback>
          <span><icon preset="bv-error"></icon> {{ $vee.error(vp) || $val.error(serverError) }}</span>
        </b-form-invalid-feedback>
        <b-form-text v-if="passwordHintVisible"> {{ password.hint }} </b-form-text>
      </b-form-group>
    </validation-provider>
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
        hint: this.$t('validation.passwordHint'),
        hideText: this.$t('general.hidePassword'),
        showText: this.$t('general.showPassword'),
      },
      form: { code: this.$route.query.oobCode, newPassword: null },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
      formState: null,
    }
  },

  computed: {
    /** [START] password-related methods */
    passwordRevealable() {
      return this.password.type === 'text'
    },

    passwordHintVisible() {
      // Note: Hint should show on initial focus. So long there is an input,
      // the validator will take over the responsibility
      return this.password.focus && !this.form.newPassword
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
      this.serverError = {
        ...this.serverError,
        validated: true,
        success: false,
        code: error.code,
        message: error.message,
      }

      // determine field error and propagate to parent if non-field error
      if (error.code === 'auth/weak-password') {
        this.serverError = {
          ...this.serverError,
          field: 'password',
          message: this.$t('validation.passwordInvalid'),
        }
        return
      }
      this.$emit(this.events.submitted, false, this.serverError)
    },

    successHandler(response) {
      this.serverError = { ...this.serverError, validated: true, success: true }
      this.$emit(this.events.submitted, true, null, response)
    },

    async submitForm() {
      const valid = this.validateForm()
      if (!valid) return

      this.resetForm()
      await this.confirmPasswordReset(this.form)
        .then((response) => this.successHandler(response))
        .catch((error) => this.errorHandler(error))
    },

    validateForm() {
      const valid = this.$refs.newPasswordForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async resetForm() {
      this.serverError = { validated: false, valid: false, field: null, code: null, message: null }
      this.$refs.newPasswordForm?.reset()
      await this.$nextTick()
      this.$emit(this.events.resetted)
    },

    onFormStateChanged(states) {
      this.formState = states
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
