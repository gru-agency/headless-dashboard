<template>
  <b-button
    :to="link"
    :size="size"
    :variant="variant"
    :disabled="disabled"
    :append="linkAppend"
    :prefetch="link ? true : false"
    @click.prevent="$emit('click')"
  >
    <icon :icon="getIcon" icon-size="sm"></icon>
    <slot> {{ getText }} </slot>
  </b-button>
</template>

<script>
export default {
  name: 'ActionButton',

  props: {
    name: { type: String, default: undefined },
    text: { type: String, default: undefined },
    link: { type: String, default: undefined },
    size: { type: String, default: 'sm' },
    variant: { type: String, default: 'light' },
    disabled: { type: Boolean, default: false },
    linkAppend: { type: Boolean, default: false },
    icon: {
      type: [String, Array],
      default() {
        return []
      },
    },
  },

  data() {
    return {
      predefined: [
        { name: 'bv-new', text: this.$t('general.new'), icon: ['fas', 'plus'] },
        { name: 'bv-edit', text: this.$t('general.edit'), icon: ['fad', 'pencil'] },
        { name: 'bv-save', text: this.$t('general.save') },
        { name: 'bv-cancel', text: this.$t('general.cancel') },
        { name: 'bv-refresh', text: this.$t('general.refresh') },
        { name: 'bv-savemore', text: this.$t('general.saveAndMore') },
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

    getIcon() {
      return typeof this.icon === 'object' && this.icon.length > 0
        ? this.icon
        : this.icon === 'string'
        ? this.icon
        : this.findPredefined?.icon
    },
  },
}
</script>
