<template>
  <b-badge :variant="variant"> {{ getText }} </b-badge>
</template>

<script>
export default {
  name: 'TagField',

  props: {
    preset: { type: String, default: undefined },
    text: { type: String, default: undefined },
    variant: { type: String, default: 'light' },
  },

  data() {
    return {
      presets: {
        'bv-active': { text: this.$t('general.active') },
        'bv-archive': { text: this.$t('general.archive') },
        'bv-optional': { text: this.$t('general.optional') },
        'bv-required': { text: this.$t('general.required') },
      },
    }
  },

  computed: {
    getPreset() {
      return this.presets[this.preset]
    },

    getText() {
      return this.text || this.getPreset?.text || undefined
    },
  },
}
</script>
