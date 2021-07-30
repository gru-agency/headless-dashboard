<template>
  <div>
    <b-navbar toggleable="lg" type="light" fixed="top" class="bg-light border-bottom px-0">
      <b-container fluid="2xl">
        <b-row no-gutters class="w-100 justify-content-between px-4">
          <b-navbar-brand class="font-weight-bold d-none d-lg-inline-block">
            {{ $config.brandName.toLowerCase() }}
          </b-navbar-brand>

          <b-navbar-toggle target="main-nav"></b-navbar-toggle>

          <b-navbar-nav class="flex-row">
            <b-nav-item
              v-b-tooltip.hover.bottom
              :title="ui.settings"
              :to="localePath(links.settings)"
              class="px-2"
              link-classes="px-2"
            >
              <icon preset="bv-setting" class="fa-gru"></icon>
            </b-nav-item>

            <users-info-menu></users-info-menu>
          </b-navbar-nav>
        </b-row>
      </b-container>
    </b-navbar>

    <b-container fluid="2xl" class="main-content">
      <b-collapse id="main-nav" tag="aside" class="main-content-nav d-lg-block bg-white" is-nav>
        <app-menu></app-menu>
      </b-collapse>

      <main class="main-content-body flex-grow-1 px-lg-4 py-8">
        <nuxt></nuxt>
      </main>
    </b-container>

    <!-- shared components -->
    <users-reauthentication-modal></users-reauthentication-modal>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',

  data() {
    return {
      ui: { settings: this.$t('modules.settings.title') },
      links: { settings: { name: 'dashboard-settings-user' } },
    }
  },

  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
    return {
      title: this.$config.brandName,
      htmlAttrs: { ...i18nHead.htmlAttrs },
      meta: [...i18nHead.meta],
      link: [...i18nHead.link],
    }
  },

  mounted() {
    this.$fireAuthStore.subscribe()
  },

  beforeDestroy() {
    this.$fireAuthStore.unsubscribe()
  },
}
</script>
