<template>
  <b-nav vertical tag="nav">
    <b-nav-text class="navbar-h d-flex align-items-center h4 font-weight-bold px-6">
      {{ $config.brandName.toLowerCase() }}
    </b-nav-text>

    <b-nav-item :to="localePath(links.home)" exact class="px-2">
      <icon preset="bv-home" :class="iconClass"></icon> {{ home }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.orders)" class="px-2">
      <icon preset="bv-order" :class="iconClass"></icon> {{ orders }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.products)" class="px-2">
      <icon preset="bv-product" :class="iconClass"></icon> {{ products }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.prices)" class="px-2">
      <icon preset="bv-price" :class="iconClass"></icon> {{ prices }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.settings)" class="px-2">
      <icon preset="bv-setting" :class="iconClass"></icon> {{ settings }}
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
  },
}
</script>
