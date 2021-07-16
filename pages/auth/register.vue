<template>
  <b-card v-if="showError" class="p-12 shadow">
    <box-state :state="boxState.success ? 'success' : 'error'" :title="boxState.title" :body="boxState.body">
    </box-state>
  </b-card>

  <b-card v-else class="p-12 shadow">
    <b-card-title> {{ ui.title }} </b-card-title>

    <div class="py-4">
      <users-registration-form
        @register-validated="onFormValidated"
        @register-submitted="onFormSubmitted"
      ></users-registration-form>
    </div>

    <div class="pb-4">
      <action-button
        :disabled="buttonDisabled"
        :text="ui.button"
        variant="primary"
        block
        @click="onFormSubmit"
      ></action-button>
    </div>

    <div class="text-center text-secondary">
      {{ ui.back }}
      <action-link :text="ui.login" :link="links.login" variant="primary"></action-link>
    </div>
  </b-card>
</template>

<script>
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
        title: this.$t('modules.users.registerTitle', { _brand: this.$config.brandName }),
        back: this.$t('modules.users.registerBack'),
        button: this.$t('modules.users.registerButton'),
        login: this.$t('general.login'),
      },
      links: { login: this.localePath('/login'), dashboard: this.localePath('/dashboard') },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
      buttonDisabled: true,
    }
  },

  computed: {
    showError() {
      const { validated, field } = this.server
      return validated && !field
    },
  },

  methods: {
    errorHandler(error) {
      this.boxState.success = false
      this.server = error

      // determine terminal error
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
