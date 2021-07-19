<template>
  <b-nav vertical tag="nav">
    <b-nav-text class="navbar-h d-flex align-items-center h4 font-weight-bold px-6">
      {{ $config.brandName.toLowerCase() }}
    </b-nav-text>

    <b-nav-item :to="localePath(links.home)" exact class="px-2">
      <fa :icon="['fad', 'home-alt']" :class="iconClass"></fa> {{ home }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.orders)" class="px-2">
      <fa :icon="['fad', 'ballot']" :class="iconClass"></fa> {{ orders }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.products)" class="px-2">
      <fa :icon="['fad', 'box']" :class="iconClass"></fa>
      {{ products }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.prices)" class="px-2">
      <fa :icon="['fad', 'dollar-sign']" :class="iconClass"></fa> {{ prices }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.settings)" class="px-2">
      <fa :icon="['fad', 'cog']" :class="iconClass"></fa> {{ settings }}
    </b-nav-item>
  </b-nav>
</template>

<script>
export default {
  name: 'AppMenu',

  data() {
    return {
      home: this.$t('general.home'),
      orders: this.$t('modules.orders.title'),
      prices: this.$t('modules.prices.title'),
      products: this.$t('modules.products.title'),
      settings: this.$t('modules.settings.title'),
      links: {
        home: { name: 'dashboard' },
        orders: { name: 'dashboard-orders' },
        prices: { name: 'dashboard-prices' },
        products: { name: 'dashboard-products' },
        settings: { name: 'dashboard-settings-user' },
      },
    }
  },

  computed: {
    iconClass() {
      return 'mr-2 fa-fw fa-gru'
    },

    iconPaddingClass() {
      return 'mr-2'
    },
  },
}
</script>
