<template>
  <validation-observer ref="registrationForm" v-slot="vo" tag="form">
    <vee-broadcaster :states="vo" @states="onFormStateChanged"></vee-broadcaster>

    <validation-provider v-slot="vp" :name="ui.email" rules="required|email|max:320">
      <b-form-group :label="ui.email" label-for="reg-email">
        <b-form-input
          id="reg-email"
          v-model="form.email"
          :state="$utils.evaluateState($vee.state(vp), $val.state(server, 'email'))"
          autocomplete="email"
          type="email"
          size="lg"
          trim
          autofocus
        ></b-form-input>
        <b-form-invalid-feedback>
          <span>
            <icon preset="bv-error"></icon> {{ $vee.error(vp) || $val.error(server) }}
            <span v-if="accountExists">
              <action-link :link="links.signin" :text="ui.signin" variant="primary"></action-link>.
            </span>
          </span>
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider v-slot="vp" :name="ui.name" immediate rules="max:320">
      <b-form-group :label="ui.name" label-for="reg-name">
        <b-form-input
          id="reg-name"
          v-model="form.name"
          :state="$vee.state(vp)"
          autocomplete="name"
          size="lg"
          trim
        ></b-form-input>
        <b-form-invalid-feedback>
          <span><icon preset="bv-error"></icon> {{ $vee.error(vp) }}</span>
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider v-slot="vp" :name="ui.password" slim mode="aggressive" rules="hint_pw:10|max:128">
      <b-form-group :label="ui.password" label-for="reg-password" class="position-relative">
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
          id="new-password"
          v-model="form.password"
          :state="$utils.evaluateState($vee.state(vp), $val.state(server, 'password'))"
          autocomplete="new-password"
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

    <b-form-group label-for="reg-consent" class="small text-secondary">
      <b-form-checkbox id="reg-consent" v-model="form.emailConsent" size="sm">
        {{ ui.consent }}
        <action-link :link="links.privacy" :text="ui.privacy" variant="primary"></action-link>
      </b-form-checkbox>
    </b-form-group>

    <b-form-group v-if="showError" class="mb-3">
      <span class="text-danger">{{ server.message }}</span>
    </b-form-group>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RegistrationForm',

  data() {
    return {
      events: {
        validate: 'register-validate',
        validated: 'register-validated',
        submit: 'register-submit',
        submitted: 'register-submitted',
        reset: 'register-reset',
        resetted: 'register-resetted',
      },
      ui: {
        email: this.$t('general.email'),
        name: this.$t('general.name'),
        password: this.$t('general.password'),
        consent: this.$t('modules.users.registerConsent', { _brand: this.$app.brandName }),
        privacy: this.$t('general.privacyPolicy'),
        signin: this.$t('general.signin').toLowerCase(),
      },
      links: { privacy: this.localePath('/privacy'), signin: this.localePath('/signin') },
      password: {
        type: 'password',
        focus: false,
        hideText: this.$t('general.hidePassword'),
        showText: this.$t('general.showPassword'),
      },
      form: { email: null, name: null, password: null, emailConsent: false },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    accountExists() {
      return this.server.code === 'auth/email-already-in-use'
    },

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
    ...mapActions('auth', ['registerWithEmailAndPassword']),

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
      } else if (error.code === 'auth/email-already-in-use') {
        this.server = {
          ...this.server,
          field: 'email',
          message: this.$t('validation.accountExists', { _brand: this.$app.brandName }),
        }
      } else if (error.code === 'auth/weak-password') {
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
      this.registerWithEmailAndPassword(this.form).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    validateForm() {
      const valid = this.$refs.registrationForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async resetForm() {
      this.resetFormState()
      this.$refs.registrationForm?.reset()
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
