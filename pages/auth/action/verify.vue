<template>
  <b-card class="px-3 shadow">
    <div v-if="$fetchState.pending"><box-state state="loading"></box-state></div>

    <div v-else>
      <box-state
        v-if="['auth/user-disabled', 'auth/user-not-found'].includes(serverError.code)"
        state="error"
        :title="boxState.title"
        :body="boxState.body"
      >
        <template #body>
          <b-card-text class="text-secondary">
            {{ boxState.body }}
            <a :href="'mailto:' + links.supportMail" class="text-primary">
              {{ links.supportMail }}
            </a>
          </b-card-text>
        </template>
      </box-state>

      <box-state
        v-else
        :state="boxState.success ? 'success' : 'error'"
        :title="boxState.title"
        :body="boxState.body"
        :btn-link="boxState.actionLink"
        :btn-text="boxState.actionText"
        btn-variant="primary"
      ></box-state>
    </div>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Verify',

  data() {
    return {
      links: { supportMail: this.$app.supportMail },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  fetchOnServer: false,

  fetch() {
    this.submitForm()
  },

  methods: {
    ...mapActions('auth', ['confirmEmail']),

    errorHandler(error) {
      this.boxState.success = false
      this.serverError = { success: false, code: error.code, message: error.message }
      if (error.code) {
        if (['auth/expired-action-code', 'auth/invalid-action-code'].includes(error.code)) {
          this.boxState = {
            title: this.$t('modules.users.verifyEmailLinkInvalid'),
            actionText: this.$t('modules.users.verifyEmailRetry'),
            actionLink: this.localePath('/dashboard/users'),
          }
        } else if (error.code === 'auth/user-disabled') {
          this.boxState = {
            title: this.$t('validation.accountSuspended'),
            body: this.$t('general.supportText'),
          }
        } else if (error.code === 'auth/user-not-found') {
          this.boxState = {
            title: this.$t('validation.accountNotFound'),
            body: this.$t('general.supportText'),
          }
        } else {
          this.boxState.title = this.$t('general.error5xx')
        }
      }
    },

    successHandler(response) {
      this.boxState = {
        success: true,
        title: this.$t('modules.users.verifyEmailSuccess'),
        actionLink: this.localePath('/dashboard'),
        actionText: this.$t('general.continueDashboard'),
      }
      this.serverError.success = true
    },

    async submitForm() {
      this.resetForm()
      const form = { code: this.$route.query.oobCode }
      await this.confirmEmail(form)
        .then((response) => this.successHandler(response))
        .catch((error) => this.errorHandler(error))
    },

    resetForm() {
      this.boxState = {
        success: false,
        title: null,
        body: null,
        actionLink: null,
        actionText: null,
      }
      this.serverError = { validated: false, valid: false, field: null, code: null, message: null }
    },
  },
}
</script>
