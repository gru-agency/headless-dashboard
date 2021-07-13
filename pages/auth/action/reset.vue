<template>
  <b-card v-if="serverError.validated" class="px-3 shadow">
    <box-state :state="boxState.success ? 'success' : 'error'" :title="boxState.title" :body="boxState.body">
      <template #body>
        <b-card-text
          v-if="['auth/user-disabled', 'auth/user-not-found'].includes(serverError.code)"
          class="text-secondary"
        >
          {{ boxState.body }}
          <a :href="'mailto:' + links.supportMail" class="text-primary">{{ links.supportMail }}</a>
        </b-card-text>
        <b-card-text v-else class="text-secondary">{{ boxState.body }}</b-card-text>
      </template>

      <template #action>
        <action-button
          v-if="['auth/expired-action-code', 'auth/invalid-action-code'].includes(serverError.code)"
          :text="boxState.actionText"
          :link="boxState.actionLink"
          variant="primary"
        ></action-button>
      </template>
    </box-state>
  </b-card>

  <b-card v-else class="px-3 shadow">
    <b-card-title class="pt-3"> {{ ui.title }} </b-card-title>

    <div class="py-3">
      <users-new-password-form
        size="lg"
        @password-validated="onFormValidated"
        @password-submitted="onFormSubmitted"
        @password-resetted="onFormResetted"
      ></users-new-password-form>
    </div>

    <div class="pb-3">
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
      links: { supportMail: this.$app.supportMail },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
      buttonDisabled: true,
    }
  },

  methods: {
    errorHandler(error) {
      this.boxState = { ...this.boxState, success: false }

      this.serverError = {
        ...this.serverError,
        validated: true,
        success: false,
        code: error.code,
        message: error.message,
      }

      // determine form/page error
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
      } else if (error.code === 'auth/user-not-found') {
        this.boxState = {
          ...this.boxState,
          title: this.$t('validation.accountNotFound'),
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
      this.serverError = { ...this.serverError, validated: true, success: true }
    },

    onFormSubmitted(success, error, response) {
      success ? this.successHandler(response) : this.errorHandler(error)
    },

    onFormValidated(valid) {
      this.buttonDisabled = !valid
    },

    async onFormResetted() {
      this.boxState = { success: false, title: null, body: null, actionLink: null, actionText: null }
      this.serverError = { validated: false, valid: false, field: null, code: null, message: null }
      await this.$nextTick()
    },

    onFormSubmit() {
      this.$nuxt.$emit(this.events.submit)
    },
  },
}
</script>
