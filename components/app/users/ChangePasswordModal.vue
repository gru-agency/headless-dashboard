<template>
  <b-modal
    id="change-password-modal"
    :title="ui.title"
    :ok-title="ui.title"
    :cancel-title="ui.cancel"
    :ok-disabled="okDisabled"
    body-bg-variant="light"
    cancel-variant="light"
    button-size="sm"
    centered
    no-stacking
    hide-header-close
    @ok.prevent="onModalOk"
    @hide="onModalHide"
  >
    <b-card-body>
      <users-new-password-form
        intent="change"
        size="lg"
        @password-validated="onFormValidated"
        @password-submitted="onFormSubmitted"
      ></users-new-password-form>
    </b-card-body>
  </b-modal>
</template>

<script>
export default {
  name: 'ChangePasswordModal',

  data() {
    return {
      events: {
        password: {
          submit: 'password-submit',
        },
        reauth: {
          success: 'reauth-success',
          cancel: 'reauth-cancel',
          error: 'reauth-error',
        },
      },
      ui: { title: this.$t('modules.users.changePasswordTitle'), cancel: this.$t('general.cancel') },
      okDisabled: true,
    }
  },

  mounted() {
    this.$nuxt.$on(this.events.reauth.success, this.onReAuthSuccess)
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.reauth.success)
  },

  methods: {
    onFormSubmitted(success, error, response) {
      if (success) {
        this.$bvModal.hide('change-password-modal')
      }
    },

    onModalOk() {
      this.$nuxt.$emit(this.events.password.submit)
    },

    onModalHide(bvModalEvent) {
      // NOTE: explicitly prevent closing by unknown trigger
      if (!bvModalEvent.trigger) {
        bvModalEvent.preventDefault()
      }
    },

    onFormValidated(valid) {
      this.okDisabled = !valid
    },

    onReAuthSuccess() {
      this.onModalOk()
    },
  },
}
</script>
