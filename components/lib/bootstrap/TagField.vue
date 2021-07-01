<template>
  <b-badge :variant="variant" class="mx-1"> {{ getText }} </b-badge>
</template>

<script>
export default {
  name: 'TagField',

  props: {
    name: { type: String, default: undefined },
    text: { type: String, default: undefined },
    variant: { type: String, default: 'light' },
  },

  data() {
    return {
      predefined: [
        { name: 'bv-optional', text: this.$t('general.optional') },
        { name: 'bv-required', text: this.$t('general.required') },
      ],
    }
  },

  computed: {
    findPredefined() {
      return this.predefined.find((el) => el.name === this.name)
    },

    getText() {
      return this.text || this.findPredefined?.text || this.name
    },
  },
}
</script>
