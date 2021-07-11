<template>
  <validation-observer ref="registrationForm" v-slot="{ invalid }" tag="form">
    <!-- broadcast form state -->
    <vee-broadcaster :invalid="invalid" @invalid="onFormInvalid"></vee-broadcaster>

    <b-form-group :label="ui.email" label-for="reg-email">
      <validation-provider v-slot="vp" :name="ui.email" rules="required|email|max:320">
        <b-form-input
          id="reg-email"
          v-model="form.email"
          :state="$vee.checkState(vp) && checkServerState('email')"
          autocomplete="email"
          type="email"
          size="lg"
          trim
          autofocus
        ></b-form-input>
        <b-form-invalid-feedback>
          <span v-if="vp.errors.length > 0">
            <icon preset="bv-error"></icon> {{ vp.errors[0] }}
          </span>
          <span v-if="serverError.validated">
            <span v-if="serverError.code === 'auth/email-already-in-use'">
              <icon preset="bv-error"></icon> {{ serverError.message }}
              <action-link :link="links.signin" :text="ui.signin" variant="primary"></action-link>.
            </span>
            <span v-else><icon preset="bv-error"></icon> {{ serverError.message }}</span>
          </span>
        </b-form-invalid-feedback>
      </validation-provider>
    </b-form-group>

    <b-form-group :label="ui.name" label-for="reg-name">
      <validation-provider v-slot="vp" :name="ui.email" rules="max:320">
        <b-form-input
          id="reg-name"
          v-model="form.name"
          :state="$vee.checkState(vp)"
          autocomplete="name"
          size="lg"
          trim
        ></b-form-input>
        <b-form-invalid-feedback>
          <icon preset="bv-error"></icon> {{ vp.errors[0] }}
        </b-form-invalid-feedback>
      </validation-provider>
    </b-form-group>

    <b-form-group :label="ui.password" label-for="reg-password">
      <validation-provider v-slot="vp" :name="ui.password" rules="required|min:10|max:128">
        <tips-field
          v-if="form.password"
          :preset="shouldRevealPassword ? 'bv-eye-slash' : 'bv-eye'"
          tooltip
          class="input-inset right"
          @click="onRevealToggle()"
        >
          {{ shouldRevealPassword ? ui.hidePassword : ui.showPassword }}
        </tips-field>
        <b-form-input
          id="reg-password"
          v-model="form.password"
          :state="$vee.checkState(vp) && checkServerState('password')"
          autocomplete="new-password"
          :type="passwordType"
          size="lg"
          trim
          @blur="passwordFocus = false"
          @focus="passwordFocus = true"
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
      <b-form-text v-if="passwordHint"> {{ ui.passwordHint }} </b-form-text>
    </b-form-group>

    <b-form-group label-for="reg-consent" class="small text-secondary">
      <b-form-checkbox id="reg-consent" v-model="form.emailConsent" size="sm">
        {{ ui.consent }}
        <action-link :link="links.privacy" :text="ui.privacy" variant="primary"></action-link>
      </b-form-checkbox>
    </b-form-group>

    <toast id="reg-toast" class="py-3" :preset="toastPreset" is-static no-auto-hide>
      {{ serverError.message }}
    </toast>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RegistrationForm',

  data() {
    return {
      links: { privacy: this.localePath('/privacy'), signin: this.localePath('/signin') },
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
        passwordHint: this.$t('validation.passwordHint'),
        consent: this.$t('modules.users.registerConsent', { _brand: this.$app.brandName }),
        privacy: this.$t('general.privacyPolicy'),
        signin: this.$t('general.signin').toLowerCase(),
        hidePassword: this.$t('general.hidePassword'),
        showPassword: this.$t('general.showPassword'),
      },
      form: { email: null, name: null, password: null, emailConsent: false },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
      passwordFocus: false,
      passwordType: 'password',
    }
  },

  computed: {
    passwordHint() {
      // only show when start typing
      return this.passwordFocus && !this.form.password
    },

    shouldRevealPassword() {
      return this.passwordType === 'text'
    },

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
    ...mapActions('auth', ['registerWithEmailAndPassword']),

    errorHandler(error) {
      this.serverError.validated = true
      if (error.code) {
        this.serverError.valid = false
        this.serverError.code = error.code
        if (error.code === 'auth/invalid-email') {
          this.serverError.field = 'email'
          this.serverError.message = this.$t('validation.emailInvalid')
        } else if (error.code === 'auth/weak-password') {
          this.serverError.field = 'password'
          this.serverError.message = this.$t('validation.passwordInvalid')
        } else if (error.code === 'auth/email-already-in-use') {
          this.serverError.field = 'email'
          this.serverError.message = this.$t('validation.accountExists', {
            _brand: this.$app.brandName,
          })
        } else {
          this.serverError.field = null
          this.serverError.message = this.$t('general.error5xx')
          this.$bvToast.show('reg-toast')
        }
        this.$emit(this.events.submitted, false)
      }
    },

    successHandler(response) {
      this.resetForm()
      this.$emit(this.events.submitted, true, response)
    },

    async submitForm() {
      const valid = await this.validateForm()
      if (!valid) {
        this.$emit(this.events.submitted, valid)
        return
      }

      this.registerWithEmailAndPassword(this.form)
        .then((response) => this.successHandler(response))
        .catch((error) => this.errorHandler(error))
    },

    async validateForm() {
      const valid = await this.$refs.registrationForm.validate().then()
      this.$emit(this.events.validated, valid)
      return valid
    },

    resetForm() {
      this.serverError = { validated: false, valid: false, field: null, code: null, message: null }
      this.form = { email: null, name: null, password: null, emailConsent: false }
      this.$nextTick(() => this.$refs.registrationForm.reset())
    },

    onRevealToggle() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text'
    },

    onFormInvalid(invalid) {
      this.$emit(this.events.validated, invalid)
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
