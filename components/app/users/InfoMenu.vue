<template>
  <b-nav-item-dropdown
    v-b-tooltip.hover.bottom
    :title="ui.profile"
    right
    no-caret
    menu-class="position-absolute"
    :toggle-class="{ 'nuxt-link-exact-active': exactLink, 'px-0': true }"
  >
    <template #button-content>
      <icon preset="bv-person" class="fa-gru"></icon>
    </template>

    <b-dd-text text-class="font-weight-normal">{{ userName }}</b-dd-text>
    <b-dd-text text-class="font-weight-normal small text-secondary">{{ userRole }}</b-dd-text>
    <b-dd-divider></b-dd-divider>
    <b-dd-item :to="localePath(links.users)" link-class="text-primary">{{ ui.profile }}</b-dd-item>
    <b-dd-item link-class="text-primary" @click.prevent="onSignOut">{{ ui.signout }}</b-dd-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'InfoMenu',

  data() {
    return {
      ui: {
        administrator: this.$t('general.administrator'),
        profile: this.$t('general.profile'),
        signout: this.$t('general.signout'),
      },
      links: { users: { name: 'dashboard-settings-user' }, login: { name: 'auth-login' } },
    }
  },

  computed: {
    ...mapState('auth', ['authUser']),
    ...mapState('user', ['user']),

    userName() {
      return this.user?.displayName || this.user?.email || this.authUser?.email || '-'
    },

    userRole() {
      return this.ui.administrator
    },

    exactLink() {
      return this.localePath(this.links.users) === this.$route.path
    },
  },

  methods: {
    ...mapActions('auth', ['signOut']),

    async onSignOut() {
      await this.signOut()
      this.$router.push(this.localePath(this.links.login))
    },
  },
}
</script>
