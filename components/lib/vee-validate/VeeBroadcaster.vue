<template>
  <span> </span>
</template>

<script>
export default {
  name: 'VeeBroadcaster',

  props: { invalid: { type: Boolean, default: null } },

  watch: {
    invalid: {
      immediate: true,
      handler() {
        this.$emit('invalid', !this.invalid)
      },
    },
  },
}
</script>
