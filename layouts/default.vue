<template>
  <nuxt> </nuxt>
</template>

<script>
export default {
  name: 'Default',

  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },

  mounted() {
    this.$fireAuthStore.subscribe()
  },

  beforeDestroy() {
    this.$fireAuthStore.unsubscribe()
  },
}
</script>
