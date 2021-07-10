<template>
  <validation-observer ref="resetForm">
    <b-form-group :label="ui.email" label-for="rst-email">
      <validation-provider v-slot="vp" :name="ui.email" rules="required|email|max:320">
        <b-form-input
          id="rst-email"
          v-model="form.email"
          :state="$vee.checkState(vp)"
          autocomplete="email"
          type="email"
          size="lg"
          trim
        ></b-form-input>
        <b-form-invalid-feedback> {{ vp.errors[0] }} </b-form-invalid-feedback>
      </validation-provider>
    </b-form-group>

    <toast preset="error"> {{ toast.message }} </toast>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ResetForm',

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
      ui: { email: this.$t('general.email') },
      form: { email: null },
      toast: {
        id: 'bvBottomCenter',
        message: null,
      },
    }
  },

  mounted() {
    this.$nuxt.$on(this.events.validate, this.validateForm)
    this.$nuxt.$on(this.events.submit, this.submitForm)
    this.$nuxt.$on(this.events.reset, this.resetForm)
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.validate)
    this.$nuxt.$off(this.events.submit)
    this.$nuxt.$off(this.events.reset)
  },

  methods: {
    ...mapActions('user', ['requestPasswordReset']),

    async validateForm() {
      const valid = await this.$refs.resetForm.validate().then()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async submitForm() {
      const valid = await this.validateForm()
      if (!valid) {
        this.$emit(this.events.submitted, valid)
        return
      }

      const { code } = await this.requestPasswordReset(this.form)
      if (code) {
        if (code === 'auth/invalid-email' || code === 'auth/user-not-found') {
          this.toast.message = this.$t('modules.users.invalidEmail')
        } else {
          this.toast.message = this.$t('general.error5xx')
        }
        this.$bvToast.show(this.toast.id)
        this.$emit(this.events.submitted, false)
        return
      }

      this.resetForm()
      this.$emit(this.events.submitted, true, this.form)
    },

    resetForm() {
      this.form.email = null
      this.$nextTick(() => this.$refs.resetForm.reset())
    },
  },
}
</script>
