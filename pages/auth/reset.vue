<template>
  <b-card v-if="showError" class="p-12 shadow">
    <box-state :state="boxState.success ? 'success' : 'error'" :title="boxState.title" :body="boxState.body">
    </box-state>
  </b-card>

  <b-card v-else class="p-12 shadow">
    <b-card-title>{{ ui.title }}</b-card-title>

    <b-card-sub-title class="py-3 text-secondary"> {{ ui.subtitle }} </b-card-sub-title>

    <div class="py-4">
      <users-reset-form @reset-submitted="onFormSubmitted"></users-reset-form>
    </div>

    <div class="pb-4">
      <action-button preset="bv-continue" variant="primary" block @click="onFormSubmit"></action-button>
    </div>

    <div class="text-center">
      <action-link :text="ui.back" :link="localePath(links.login)"></action-link>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'Reset',
  layout: 'simpli',

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
      ui: {
        title: this.$t('modules.users.resetTitle'),
        subtitle: this.$t('modules.users.resetSubtitle'),
        back: this.$t('general.returnLogin'),
      },
      links: { login: { name: 'auth-login' } },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
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
      this.boxState = { ...this.boxState, success: false, title: this.$t('general.error5xx') }
      this.server = error
    },

    successHandler(response) {
      this.boxState = {
        ...this.boxState,
        success: true,
        title: this.$t('modules.users.resetSuccessTitle'),
        body: this.$t('modules.users.resetSuccessSubtitle'),
      }
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
