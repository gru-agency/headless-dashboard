<template>
  <div v-if="product">
    <products-info-card :product="product"></products-info-card>
    <products-price-card :prices="prices" :product="objectId"></products-price-card>
  </div>

  <box-state
    v-else
    state="empty"
    icon-preset="bv-product"
    :title="notFoundTitle"
    :body="notFoundSubtitle"
    :btn-text="notFoundButton"
    :btn-link="listLink"
    btn-size="sm"
    icon-holder
  ></box-state>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  layout: 'dashboard',

  data() {
    return {
      notFoundTitle: this.$t('modules.products.notFoundTitle'),
      notFoundSubtitle: this.$t('modules.products.notFoundSubtitle'),
      notFoundButton: this.$t('modules.products.notFoundButton'),
    }
  },

  head() {
    return {
      title: this.$t('seo.products', { _brand: this.$config.brandName }),
    }
  },

  computed: {
    ...mapGetters('user', ['account']),
    ...mapGetters('products', ['find']),

    objectId() {
      const parts = this.$route.params.id.split('_')
      return parts.length === 2 ? parts[1] : parts[0]
    },

    product() {
      return this.find(this.objectId, this.account)
    },

    prices() {
      return this.product?.prices
    },

    listLink() {
      return this.localePath({ name: 'dashboard-products' })
    },
  },
}
</script>
