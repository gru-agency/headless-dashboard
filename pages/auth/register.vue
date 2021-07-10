<template>
  <b-card class="px-3 shadow">
    <b-card-title class="pt-3"> {{ ui.title }} </b-card-title>
    <div class="py-3">
      <users-registration-form
        @register-validated="onValidated"
        @register-submitted="onSubmitted"
      ></users-registration-form>
    </div>
    <div class="pb-3">
      <action-button
        :text="ui.button"
        :disabled="shouldButtonMuted"
        variant="primary"
        block
        @click="onSubmit"
      ></action-button>
    </div>
    <div class="pb-3 text-center text-secondary">
      {{ ui.back }}
      <action-link :text="ui.signin" :link="links.signin" variant="primary"></action-link>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'Register',

  layout: 'simpli',

  data() {
    return {
      links: { signin: this.localePath('/signin'), dashboard: this.localePath('/dashboard') },
      ui: {
        title: this.$t('modules.users.registerTitle', { _brand: this.$app.brandName }),
        back: this.$t('modules.users.registerBack'),
        button: this.$t('modules.users.registerButton'),
        signin: this.$t('general.signin'),
      },
      events: {
        validate: 'register-validate',
        validated: 'register-validated',
        submit: 'register-submit',
        submitted: 'register-submitted',
        reset: 'register-reset',
        resetted: 'register-resetted',
      },
      shouldButtonMuted: false,
    }
  },

  methods: {
    onValidated(valid) {
      this.shouldButtonMuted = !valid
    },

    onSubmitted(result, payload) {
      if (result) this.$router.push(this.links.dashboard)
    },

    onSubmit() {
      this.$nuxt.$emit(this.events.submit)
    },
  },
}
</script>
