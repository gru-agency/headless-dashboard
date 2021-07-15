<template>
  <b-card v-if="showError" class="p-12 shadow">
    <box-state :state="boxState.success ? 'success' : 'error'" :title="boxState.title" :body="boxState.body">
      <template #body>
        <b-card-text v-if="accountIssues" class="text-secondary">
          {{ boxState.body }}
          <a :href="'mailto:' + supportMail" class="text-primary">{{ supportMail }}</a>
        </b-card-text>
        <b-card-text v-else class="text-secondary">{{ boxState.body }}</b-card-text>
      </template>

      <template #action>
        <action-button
          v-if="codeIssues"
          :text="boxState.actionText"
          :link="boxState.actionLink"
          variant="primary"
        ></action-button>
      </template>
    </box-state>
  </b-card>

  <b-card v-else class="p-12 shadow">
    <b-card-title>{{ ui.title }}</b-card-title>

    <div class="py-4">
      <users-new-password-form
        size="lg"
        @password-validated="onFormValidated"
        @password-submitted="onFormSubmitted"
      ></users-new-password-form>
    </div>

    <div class="pb-4">
      <action-button
        :disabled="buttonDisabled"
        preset="bv-continue"
        variant="primary"
        block
        @click="onFormSubmit"
      ></action-button>
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
        validate: 'password-validate',
        validated: 'password-validated',
        submit: 'password-submit',
        submitted: 'password-submitted',
        reset: 'password-reset',
        resetted: 'password-resetted',
      },
      ui: { title: this.$t('modules.users.resetTitle') },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
      buttonDisabled: true,
    }
  },

  computed: {
    supportMail() {
      return this.$app.supportMail
    },

    showError() {
      const { validated, field } = this.server
      return validated && !field
    },

    accountIssues() {
      return ['auth/user-disabled', 'auth/user-not-found'].includes(this.server.code)
    },

    codeIssues() {
      return ['auth/expired-action-code', 'auth/invalid-action-code'].includes(this.server.code)
    },
  },

  methods: {
    errorHandler(error) {
      this.boxState = { ...this.boxState, success: false }
      this.server = error

      // determine terminal error
      if (['auth/expired-action-code', 'auth/invalid-action-code'].includes(error.code)) {
        this.boxState = {
          ...this.boxState,
          title: this.$t('modules.users.resetPasswordLinkInvalid'),
          actionText: this.$t('modules.users.resetPasswordRetry'),
          actionLink: this.localePath('/reset'),
        }
      } else if (error.code === 'auth/user-disabled') {
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
      this.boxState = {
        ...this.boxState,
        success: true,
        title: this.$t('modules.users.resetPasswordSuccess'),
        actionLink: this.localePath('/dashboard'),
        actionText: this.$t('general.continueDashboard'),
      }
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
