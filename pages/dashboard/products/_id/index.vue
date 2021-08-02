<template>
  <products-info-card></products-info-card>
</template>

<script>
export default {
  name: 'Index',
  layout: 'dashboard',

  head() {
    return {
      title: this.$t('seo.products', { _brand: this.$config.brandName }),
    }
  },
}
</script>
