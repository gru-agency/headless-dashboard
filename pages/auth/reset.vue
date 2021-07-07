<template>
  <div class="bg-light">
    <b-container class="vh-100 bg-fixed-500 d-flex flex-column">
      <div class="flex-grow-1"></div>

      <div class="align-self-start py-4 mx-4 px-3">
        <span class="h3 font-weight-bolder"> {{ ui.brandName }} </span>
      </div>

      <b-row class="w-100 align-self-center">
        <b-card class="px-3 shadow">
          <b-card-title class="pt-3"> {{ ui.title }} </b-card-title>
          <b-card-sub-title class="py-3 text-secondary"> {{ ui.subtitle }} </b-card-sub-title>
          <div class="py-3">
            <users-reset-form @reset-submitted="onSubmitted"></users-reset-form>
          </div>
          <div class="pb-3">
            <action-button
              preset="bv-continue"
              variant="primary"
              block
              @click="onSubmit"
            ></action-button>
          </div>
          <div class="pb-3 text-center">
            <action-link :text="ui.back" :link="link.signin"></action-link>
          </div>
        </b-card>
      </b-row>

      <ul class="align-self-start py-4 mx-4 px-3 list-unstyled">
        <b-link v-for="item in menus" :key="item.label" :href="item.link" class="pr-2">
          {{ item.label }}
        </b-link>
      </ul>

      <div class="flex-grow-1"></div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Reset',

  layout: 'default',

  data() {
    return {
      link: { signin: this.localePath('/signin') },
      ui: {
        brandName: this.$app.brandName.toLowerCase(),
        title: this.$t('modules.users.resetTitle'),
        subtitle: this.$t('modules.users.resetSubtitle'),
        back: this.$t('modules.users.resetBack'),
      },
      menus: {
        home: { label: '© ' + this.$app.brandName, link: this.localePath('/') },
        contact: { label: this.$t('general.contact'), link: this.localePath('/contact') },
        privacy: { label: this.$t('general.privacy'), link: this.localePath('/privacy') },
        terms: { label: this.$t('general.terms'), link: this.localePath('/terms') },
      },
      events: {
        validate: 'reset-validate',
        validated: 'reset-validated',
        submit: 'reset-submit',
        submitted: 'reset-submitted',
        reset: 'reset-reset',
        resetted: 'reset-resetted',
      },
    }
  },

  methods: {
    onSubmitted(result, payload) {
      console.log('🚀 ~ file: reset.vue ~ line 76 ~ onSubmitted ~ result, payload', result, payload)
    },

    onSubmit() {
      this.$nuxt.$emit(this.events.submit)
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-fixed-500 {
  width: 500px;
}
</style>
