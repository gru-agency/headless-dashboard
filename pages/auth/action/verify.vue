<template>
  <b-card v-if="$fetchState.pending" class="p-12 shadow">
    <box-state state="loading"></box-state>
  </b-card>

  <b-card v-else class="p-12 shadow">
    <box-state v-if="accountIssues" state="error" :title="boxState.title" :body="boxState.body">
      <template #body>
        <b-card-text class="text-secondary">
          {{ boxState.body }}
          <a :href="'mailto:' + links.supportMail" class="text-primary">{{ links.supportMail }}</a>
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
  </b-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Verify',
  layout: 'simpli',

  data() {
    return {
      links: {
        supportMail: this.$config.supportMail,
        users: { name: 'dashboard-users' },
        dashboard: { name: 'dashboard' },
      },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  fetchOnServer: false,

  fetch() {
    this.submitForm()
  },

  computed: {
    accountIssues() {
      return ['auth/user-disabled'].includes(this.server.code)
    },

    codeIssues() {
      return ['auth/expired-action-code', 'auth/invalid-action-code'].includes(this.server.code)
    },
  },

  methods: {
    ...mapActions('auth', ['confirmEmail']),

    errorHandler(error) {
      this.boxState = { ...this.boxState, success: false }

      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: error.message,
      }

      // determine terminal error
      if (['auth/expired-action-code', 'auth/invalid-action-code'].includes(error.code)) {
        this.boxState = {
          ...this.boxState,
          title: this.$t('modules.users.verifyEmailLinkInvalid'),
          actionText: this.$t('modules.users.verifyEmailRetry'),
          actionLink: this.localePath(this.links.users),
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
        title: this.$t('modules.users.verifyEmailSuccess'),
        actionLink: this.localePath(this.links.dashboard),
        actionText: this.$t('general.continueDashboard'),
      }
      this.server = { ...this.server, validated: true, valid: true }
      this.resetForm()
    },

    submitForm() {
      this.resetFormState()
      this.confirmEmail({ code: this.$route.query.oobCode }).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    async resetForm() {
      this.resetFormState()
      await this.$nextTick()
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },
  },
}
</script>
