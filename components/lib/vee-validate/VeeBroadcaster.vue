<template>
  <span> </span>
</template>

<script>
export default {
  name: 'VeeBroadcaster',

  props: { states: { type: Object, default: () => undefined } },

  watch: {
    states: {
      immediate: true,
      handler() {
        this.$emit('states', this.states)
      },
    },
  },
}
</script>
