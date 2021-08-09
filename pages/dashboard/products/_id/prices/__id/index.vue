<template>
  <div v-if="product">
    <prices-info-card :product="product" :price="price"></prices-info-card>
  </div>

  <box-state
    v-else
    state="empty"
    icon-preset="bv-price"
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
      notFoundTitle: this.$t('modules.prices.notFoundTitle'),
      notFoundSubtitle: this.$t('modules.prices.notFoundSubtitle'),
      notFoundButton: this.$t('modules.products.notFoundButton'),
    }
  },

  head() {
    return {
      title: this.$t('seo.prices', { _brand: this.$config.brandName }),
    }
  },

  computed: {
    ...mapGetters('user', ['account']),
    ...mapGetters('products', ['find']),

    productId() {
      const parts = this.$route.params.id.split('_')
      return parts.length === 2 ? parts[1] : parts[0]
    },

    product() {
      return this.find(this.productId, this.account)
    },

    priceId() {
      const parts = this.$route.params._id.split('_')
      return parts.length === 2 ? parts[1] : parts[0]
    },

    price() {
      return this.product?.prices?.find((el) => el.id === this.priceId)
    },

    listLink() {
      return this.localePath({ name: 'dashboard-products' })
    },
  },
}
</script>
