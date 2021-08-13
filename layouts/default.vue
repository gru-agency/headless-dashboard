<template>
  <nuxt> </nuxt>
</template>

<script>
export default {
  name: 'Default',

  head() {
    return this.$nuxtI18nHead({ addDirAttribute: true, addSeoAttributes: true })
  },

  mounted() {
    this.$fireAuthStore.subscribe()
  },

  beforeDestroy() {
    this.$fireAuthStore.unsubscribe()
  },
}
</script>
