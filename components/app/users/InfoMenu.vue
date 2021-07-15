<template>
  <b-nav-item-dropdown right no-caret class="z-alert">
    <template #button-content>
      <tips-field preset="bv-person" placement="bottom" tooltip> {{ ui.profile }} </tips-field>
    </template>

    <b-dd-text text-class="font-weight-normal">{{ userName }}</b-dd-text>
    <b-dd-text text-class="font-weight-normal small text-secondary">{{ userRole }}</b-dd-text>
    <b-dd-divider></b-dd-divider>
    <b-dd-item :to="links.users" link-class="text-primary">{{ ui.profile }}</b-dd-item>
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
      links: { users: this.localePath('/dashboard/users'), login: this.localePath('/login') },
    }
  },

  fetchOnServer: false,

  fetch() {
    this.fetchUser()
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
  },

  methods: {
    ...mapActions('auth', ['signOut']),
    ...mapActions('user', ['get']),

    fetchUser() {
      if (!this.authUser) {
        // todo authUser is null
        return
      }
      this.get(this.authUser)
    },

    async onSignOut() {
      await this.signOut()
      this.$router.push(this.links.login)
    },
  },
}
</script>
