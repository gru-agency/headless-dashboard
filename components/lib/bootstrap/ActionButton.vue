<template>
  <b-button
    v-b-modal="modal"
    :to="link"
    :size="size"
    :exact="exact"
    :block="block"
    :variant="variant"
    :disabled="disabled"
    :append="linkAppend"
    :prefetch="link ? true : false"
    @click.prevent="$emit('click')"
  >
    <icon :icon="getIcon" size="sm" :preset="iconPreset" class="fa-sm"></icon>
    <slot> {{ getText }} </slot>
  </b-button>
</template>

<script>
export default {
  name: 'ActionButton',

  props: {
    preset: { type: String, default: undefined },
    text: { type: String, default: undefined },
    link: { type: String, default: undefined },
    size: { type: String, default: undefined },
    block: { type: Boolean, default: false },
    variant: { type: String, default: 'light' },
    disabled: { type: Boolean, default: false },
    linkAppend: { type: Boolean, default: false },
    icon: { type: Array, default: () => null },
    modal: { type: String, default: undefined },
    exact: { type: [Boolean, String], default: true },
    iconPreset: { type: String, default: undefined },
  },

  data() {
    return {
      presets: {
        'bv-new': { text: this.$t('general.new'), icon: ['far', 'plus'] },
        'bv-edit': { text: this.$t('general.edit'), icon: ['fad', 'pencil'] },
        'bv-next': { text: this.$t('general.next'), icon: undefined },
        'bv-prev': { text: this.$t('general.previous'), icon: undefined },
        'bv-save': { text: this.$t('general.save'), icon: undefined },
        'bv-cancel': { text: this.$t('general.cancel'), icon: undefined },
        'bv-refresh': { text: this.$t('general.refresh'), icon: undefined },
        'bv-continue': { text: this.$t('general.continue'), icon: undefined },
        'bv-savemore': { text: this.$t('general.saveAndMore'), icon: undefined },
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

    getIcon() {
      return this.icon || this.getPreset?.icon || undefined
    },
  },
}
</script>
