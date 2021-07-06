<template>
  <nuxt> </nuxt>
</template>

<script>
export default {
  name: 'Default',

  mounted() {
    this.$fireAuthStore.subscribe()
  },

  beforeDestroy() {
    this.$fireAuthStore.unsubscribe()
  },
}
</script>
