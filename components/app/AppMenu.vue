<template>
  <b-nav vertical>
    <b-nav-text class="navbar-h d-flex align-items-center h4 font-weight-bold px-4">
      {{ $app.brandName.toLowerCase() }}
    </b-nav-text>
    <b-nav-item :to="links.home" :exact-active-class="activeClass" class="px-2">
      <b-icon-house-door :class="iconPaddingClass"></b-icon-house-door> {{ home }}
    </b-nav-item>
    <b-nav-item
      :to="links.orders"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <b-icon-files :class="iconPaddingClass"></b-icon-files> {{ orders }}
    </b-nav-item>
    <b-nav-item
      :to="links.products"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <b-icon-box-seam :class="iconPaddingClass"></b-icon-box-seam> {{ products }}
    </b-nav-item>
    <b-nav-item
      :to="links.prices"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <b-icon-cash :class="iconPaddingClass"></b-icon-cash> {{ prices }}
    </b-nav-item>
    <b-nav-item
      :to="links.settings"
      :active-class="activeClass"
      :exact-active-class="activeClass"
      class="px-2"
    >
      <b-icon-gear :class="iconPaddingClass"></b-icon-gear> {{ settings }}
    </b-nav-item>
  </b-nav>
</template>

<script>
import { BIconHouseDoor, BIconFiles, BIconBoxSeam, BIconCash, BIconGear } from 'bootstrap-vue'

export default {
  name: 'AppMenu',

  components: {
    BIconHouseDoor,
    BIconBoxSeam,
    BIconFiles,
    BIconCash,
    BIconGear,
  },

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
    iconPaddingClass() {
      return 'mr-3'
    },

    activeClass() {
      return 'active'
    },
  },
}
</script>
