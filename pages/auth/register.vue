<template>
  <b-card v-if="shouldShowBoxState" class="px-3 shadow">
    <box-state :state="boxState.success ? 'success' : 'error'" :title="boxState.title" :body="boxState.body">
    </box-state>
  </b-card>

  <b-card v-else class="p-4 shadow">
    <b-card-title class="pt-3"> {{ ui.title }} </b-card-title>

    <div class="py-3">
      <users-registration-form
        @register-validated="onFormValidated"
        @register-submitted="onFormSubmitted"
      ></users-registration-form>
    </div>

    <div class="pb-3">
      <action-button
        :disabled="buttonDisabled"
        :text="ui.button"
        variant="primary"
        block
        @click="onFormSubmit"
      ></action-button>
    </div>

    <div class="pb-3 text-center text-secondary">
      {{ ui.back }}
      <action-link :text="ui.signin" :link="links.signin" variant="primary"></action-link>
    </div>
  </b-card>
</template>

<script>
import consola from 'consola'

export default {
  name: 'Register',

  layout: 'simpli',

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
        title: this.$t('modules.users.registerTitle', { _brand: this.$app.brandName }),
        back: this.$t('modules.users.registerBack'),
        button: this.$t('modules.users.registerButton'),
        signin: this.$t('general.signin'),
      },
      links: { signin: this.localePath('/signin'), dashboard: this.localePath('/dashboard') },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
      buttonDisabled: true,
    }
  },

  computed: {
    shouldShowBoxState() {
      return this.serverError.validated && !this.serverError.field
    },
  },

  methods: {
    errorHandler(error) {
      this.boxState = { ...this.boxState, success: false }
      this.serverError = error

      // determine form/page error
      if (error.code === 'auth/operation-not-allowed') {
        // TODO use analytis to log this developer's error
        consola.error('errorHandler', 'Receiving dev error -> auth/operation-not-allowed')
      }
      this.boxState = { ...this.boxState, title: this.$t('general.error5xx') }
    },

    successHandler(response) {
      this.$router.push(this.links.dashboard)
    },

    onFormSubmitted(success, error, response) {
      success ? this.successHandler(response) : this.errorHandler(error)
    },

    onFormValidated(valid) {
      this.buttonDisabled = !valid
    },

    onFormSubmit() {
      this.$nuxt.$emit(this.events.submit)
    },
  },
}
</script>
