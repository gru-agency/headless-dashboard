<template>
  <b-modal
    id="reauth-modal"
    :title="ui.title"
    :ok-title="ui.continue"
    :cancel-title="ui.cancel"
    body-bg-variant="light"
    cancel-variant="light"
    button-size="sm"
    centered
    no-stacking
    hide-header-close
    @cancel="onReAuthCancel"
    @ok.prevent="onReAuthOk"
  >
    <b-card-body>
      <b-card-sub-title class="pb-6 text-secondary"> {{ ui.subtitle }} </b-card-sub-title>
      <users-login-form intent="reauth" @login-submitted="onFormSubmitted"></users-login-form>
    </b-card-body>
  </b-modal>
</template>

<script>
export default {
  name: 'ReauthenticationModal',

  data() {
    return {
      events: {
        reauth: {
          cancel: 'reauth-cancel',
          success: 'reauth-success',
          error: 'reauth-error',
        },
        login: { submit: 'login-submit' },
      },
      ui: {
        title: this.$t('modules.users.reauthenticateTitle'),
        subtitle: this.$t('modules.users.reauthenticateSubtitle'),
        cancel: this.$t('general.cancel'),
        continue: this.$t('general.continue'),
      },
    }
  },

  methods: {
    onFormSubmitted(success, error, response) {
      if (success) {
        this.$nuxt.$emit(this.events.reauth.success)
        this.$bvModal.hide('reauth-modal')
      } else {
        this.$nuxt.$emit(this.events.reauth.error, error)
      }
    },

    onReAuthCancel() {
      this.$nuxt.$emit(this.events.reauth.cancel)
    },

    onReAuthOk() {
      this.$nuxt.$emit(this.events.login.submit)
    },
  },
}
</script>
