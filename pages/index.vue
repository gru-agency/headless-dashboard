<template>
  <Tutorial />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  // middleware: 'redirect',
  mounted() {
    window.console.log(this.$nuxt)
  },
})
</script>
