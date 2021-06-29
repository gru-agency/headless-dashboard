<template>
  <div>
    <Tutorial />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    window.console.log(this.$nuxt)
  },
})
</script>
