<template>
  <b-nav vertical tag="nav">
    <b-nav-text class="navbar-h d-flex align-items-center h4 font-weight-bold px-4">
      {{ $app.brandName.toLowerCase() }}
    </b-nav-text>

    <b-nav-item :to="links.home" :exact-active-class="activeClass" class="px-2">
      <fa :icon="['fad', 'home-alt']" :class="iconClass"></fa> {{ home }}
    </b-nav-item>

    <b-nav-item
      :to="links.orders"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <fa :icon="['fad', 'ballot']" :class="iconClass"></fa> {{ orders }}
    </b-nav-item>

    <b-nav-item
      :to="links.products"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <fa :icon="['fad', 'box']" :class="iconClass"></fa>
      {{ products }}
    </b-nav-item>

    <b-nav-item
      :to="links.prices"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <fa :icon="['fad', 'dollar-sign']" :class="iconClass"></fa> {{ prices }}
    </b-nav-item>

    <b-nav-item
      :to="links.settings"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
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
        home: this.localePath('/dashboard'),
        orders: this.localePath('/dashboard/orders'),
        prices: this.localePath('/dashboard/prices'),
        products: this.localePath('/dashboard/products'),
        settings: this.localePath('/dashboard/settings'),
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

    activeClass() {
      return 'active'
    },
  },
}
</script>
