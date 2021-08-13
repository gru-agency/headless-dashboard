<template>
  <div>
    <box-header :title-text="ui.title" new-btn :modal="priceModal"></box-header>
    <prices-table :datasource="prices" :product="product"></prices-table>

    <!-- specifically used to create price -->
    <prices-modal :id="priceModal" :product="product"></prices-modal>
  </div>
</template>

<script>
export default {
  name: 'PriceCard',

  props: {
    prices: { type: Array, default: () => [] },
    product: { type: String, default: undefined },
  },

  data() {
    return {
      ui: { title: this.$t('modules.prices.title') },
      priceModal: 'price-modal',
    }
  },
}
</script>
