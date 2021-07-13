<template>
  <b-card v-if="shouldShowBoxState" class="px-3 shadow">
    <box-state :state="boxState.success ? 'success' : 'error'" :title="boxState.title" :body="boxState.body">
    </box-state>
  </b-card>

  <b-card v-else class="p-4 shadow">
    <b-card-title class="pt-3"> {{ ui.title }} </b-card-title>

    <b-card-sub-title class="py-3 text-secondary"> {{ ui.subtitle }} </b-card-sub-title>

    <div class="py-3">
      <users-reset-form @reset-submitted="onFormSubmitted"></users-reset-form>
    </div>

    <div class="pb-3">
      <action-button preset="bv-continue" variant="primary" block @click="onFormSubmit"></action-button>
    </div>

    <div class="pb-3 text-center">
      <action-link :text="ui.back" :link="links.signin"></action-link>
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
        back: this.$t('general.returnSignIn'),
      },
      links: { signin: this.localePath('/signin') },
      boxState: { success: false, title: null, body: null, actionLink: null, actionText: null },
      serverError: { validated: false, valid: false, field: null, code: null, message: null },
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
      this.boxState = { ...this.boxState, title: this.$t('general.error5xx') }
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
