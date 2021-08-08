<template>
  <b-nav tag="nav" class="py-4 py-lg-8" vertical>
    <b-nav-item :to="localePath(links.home)" exact>
      <icon preset="bv-home" :class="iconClass"></icon> {{ home }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.orders)">
      <icon preset="bv-order" :class="iconClass"></icon> {{ orders }}
    </b-nav-item>

    <b-nav-item :to="localePath(links.products)">
      <icon preset="bv-product" :class="iconClass"></icon> {{ products }}
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
      products: this.$t('modules.products.title'),
      links: {
        home: { name: 'dashboard' },
        orders: { name: 'dashboard-orders' },
        products: { name: 'dashboard-products' },
      },
    }
  },

  computed: {
    iconClass() {
      return 'mr-2 fa-gru'
    },
  },
}
</script>
