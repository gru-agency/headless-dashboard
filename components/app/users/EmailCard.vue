<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="ui.title" :subtitle-text="ui.subtitle"> </box-header>

    <b-list-group flush>
      <b-list-group-item href="#" @click.stop.prevent="toggleCheckBox('getstarted')">
        <b-form-checkbox v-model="form.emailConsent">
          <div class="w-100 pl-2">
            <h6>{{ ui.getStartedTitle }}</h6>
          </div>
          <span class="text-muted pl-2">{{ ui.getStartedSubtitle }}</span>
        </b-form-checkbox>
      </b-list-group-item>
    </b-list-group>

    <b-card-footer class="border-top">
      <div class="d-flex justify-content-end">
        <action-button preset="bv-cancel" size="sm" class="mr-2" @click="restore"></action-button>
        <action-button
          :disabled="!dirty"
          preset="bv-save"
          size="sm"
          variant="primary"
          @click="save"
        ></action-button>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EmailCard',

  data() {
    return {
      ui: {
        title: this.$t('modules.users.emailTitle'),
        subtitle: this.$t('modules.users.emailSubtitle', { _brand: this.$config.brandName }),
        getStartedTitle: this.$t('modules.users.emailGetStartedTitle'),
        getStartedSubtitle: this.$t('modules.users.emailGetStartedSubtitle', {
          _brand: this.$config.brandName,
        }),
      },
      form: {
        emailConsent: false,
      },
    }
  },

  computed: {
    ...mapState('user', ['user']),

    getStarted() {
      return this.user?.emailConsent || false
    },

    dirty() {
      for (const key in this.form) {
        if (this.getStarted !== this.form[key]) return true
      }
      return false
    },
  },

  watch: {
    getStarted(newValue) {
      this.form.emailConsent = newValue
    },
  },

  methods: {
    ...mapActions('user', ['update']),

    restore() {
      this.form.emailConsent = this.getStarted
    },

    save() {
      this.update({ docId: this.user.id, payload: { emailConsent: this.form.emailConsent } })
    },

    toggleCheckBox(stateId) {
      if (stateId === 'getstarted') this.form.emailConsent = !this.form.emailConsent
    },
  },
}
</script>
