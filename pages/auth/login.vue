<template>
  <b-card v-if="showError" class="p-12 shadow">
    <box-state state="error" :title="boxState.title" :body="boxState.body">
      <template #body>
        <b-card-text v-if="server.code === 'auth/user-disabled'" class="text-secondary">
          {{ boxState.body }}
          <a :href="'mailto:' + supportMail" class="text-primary">{{ supportMail }}</a>
        </b-card-text>
        <b-card-text v-else class="text-secondary">{{ boxState.body }}</b-card-text>
      </template>
    </box-state>
  </b-card>

  <b-card v-else class="p-12 shadow">
    <b-card-title> {{ ui.title }} </b-card-title>

    <div class="py-4">
      <users-login-form @login-submitted="onFormSubmitted"></users-login-form>
    </div>

    <div class="pb-4">
      <action-button preset="bv-continue" variant="primary" block @click="onFormSubmit"></action-button>
    </div>

    <div class="text-secondary text-center">
      {{ ui.back }}
      <action-link :text="ui.signup" :link="localePath(links.signup)" variant="primary"></action-link>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'Login',
  layout: 'simpli',

  data() {
    return {
      events: {
        validate: 'login-validate',
        validated: 'login-validated',
        submit: 'login-submit',
        submitted: 'login-submitted',
        reset: 'login-reset',
        resetted: 'login-resetted',
      },
      ui: {
        title: this.$t('modules.users.loginTitle'),
        back: this.$t('modules.users.loginBack'),
        signup: this.$t('general.signup'),
      },
      links: { signup: { name: 'auth-register' }, dashboard: { name: 'dashboard' } },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    supportMail() {
      return this.$config.supportMail
    },

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
      if (error.code === 'auth/user-disabled') {
        this.boxState = {
          ...this.boxState,
          title: this.$t('validation.accountSuspended'),
          body: this.$t('general.supportText'),
        }
      } else {
        this.boxState = { ...this.boxState, title: this.$t('general.error5xx') }
      }
    },

    successHandler(response) {
      this.$router.push(this.localePath(this.links.dashboard))
    },

    onFormSubmitted(success, error, response) {
      success ? this.successHandler(response) : this.errorHandler(error)
    },

    onFormSubmit() {
      this.$nuxt.$emit(this.events.submit)
    },
  },
}
</script>
