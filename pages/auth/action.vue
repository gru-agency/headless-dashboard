<template>
  <b-card v-if="!interpretPath" class="px-3 shadow">
    <box-state
      state="error"
      :title="ui.title"
      :body="ui.subtitle"
      :btn-link="localePath(links.home)"
      :btn-text="ui.home"
      btn-variant="primary"
    ></box-state>
  </b-card>

  <nuxt-child v-else></nuxt-child>
</template>

<script>
export default {
  name: 'Action',

  layout: 'simpli',

  data() {
    return {
      links: { home: { name: 'index' } },
      ui: {
        title: this.$t('general.error404Title'),
        subtitle: this.$t('general.error404Subtitle'),
        home: this.$t('general.returnHome'),
      },
    }
  },

  computed: {
    mode() {
      return this.$route.query.mode
    },

    interpretPath() {
      if (this.$route.query.mode === 'resetPassword') {
        return '/action/reset'
      } else if (this.$route.query.mode === 'verifyEmail') {
        return '/action/verify'
      } else {
        return undefined
      }
    },
  },

  mounted() {
    this.redirectToActionHandler()
  },

  methods: {
    redirectToActionHandler() {
      this.action = this.interpretPath
      if (this.interpretPath) {
        this.$router.push(
          this.localePath({
            path: this.interpretPath,
            query: { mode: this.mode, oobCode: this.$route.query.oobCode },
          })
        )
      }
    },
  },
}
</script>
