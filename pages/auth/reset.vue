<template>
  <b-card v-if="!serverSuccess" class="p-4 shadow">
    <b-card-title class="pt-3"> {{ ui.title }} </b-card-title>
    <b-card-sub-title class="py-3 text-secondary"> {{ ui.subtitle }} </b-card-sub-title>
    <div class="py-3">
      <users-reset-form @reset-submitted="onSubmitted"></users-reset-form>
    </div>
    <div class="pb-3">
      <action-button preset="bv-continue" variant="primary" block @click="onSubmit"></action-button>
    </div>
    <div class="pb-3 text-center">
      <action-link :text="ui.back" :link="links.signin"></action-link>
    </div>
  </b-card>

  <b-card v-else class="px-3 shadow">
    <box-state :title="ui.successTitle" :body="ui.successSubtitle" btn-hide success>
      <template #icon>
        <b-avatar size="3rem" variant="light" rounded>
          <icon :icon="['fad', 'check-double']" class="text-success"></icon>
        </b-avatar>
      </template>
    </box-state>
  </b-card>
</template>

<script>
export default {
  name: 'Reset',

  layout: 'simpli',

  data() {
    return {
      links: { signin: this.localePath('/signin') },
      ui: {
        title: this.$t('modules.users.resetTitle'),
        subtitle: this.$t('modules.users.resetSubtitle'),
        back: this.$t('modules.users.resetBack'),
        successTitle: this.$t('modules.users.resetSuccessTitle'),
        successSubtitle: this.$t('modules.users.resetSuccessSubtitle'),
      },
      events: {
        validate: 'reset-validate',
        validated: 'reset-validated',
        submit: 'reset-submit',
        submitted: 'reset-submitted',
        reset: 'reset-reset',
        resetted: 'reset-resetted',
      },
      serverSuccess: false,
    }
  },

  methods: {
    onSubmitted(result) {
      this.serverSuccess = result
    },

    onSubmit() {
      this.$nuxt.$emit(this.events.submit)
    },
  },
}
</script>
