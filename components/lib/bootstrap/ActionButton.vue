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
    <b-icon
      v-if="hasIcon"
      :icon="getIcon"
      :class="iconClass || name === 'bv-edit' ? 'mr-1' : undefined"
      :style="iconStyle"
      :shift-v="iconShiftV || name === 'bv-edit' ? '2' : undefined"
      :shift-h="iconShiftH"
      :font-scale="iconSize || name === 'bv-edit' ? '0.95' : undefined"
    ></b-icon>
    <slot> {{ getText }} </slot>
  </b-button>
</template>

<script>
import { BIcon, BIconPlus, BIconPencilFill } from 'bootstrap-vue'

export default {
  name: 'ActionButton',

  components: {
    BIcon,
    BIconPlus, // eslint-disable-line vue/no-unused-components
    BIconPencilFill, // eslint-disable-line vue/no-unused-components
  },

  props: {
    name: { type: String, default: undefined },
    text: { type: String, default: undefined },
    link: { type: String, default: undefined },
    size: { type: String, default: 'sm' },
    variant: { type: String, default: 'light' },
    disabled: { type: Boolean, default: false },
    linkAppend: { type: Boolean, default: false },
    // not recommended to use since icon is import explicitly
    icon: { type: String, default: undefined },
    iconClass: { type: String, default: undefined },
    iconStyle: { type: String, default: undefined },
    iconShiftV: { type: String, default: undefined },
    iconShiftH: { type: String, default: undefined },
    iconSize: { type: Number, default: 1 },
  },

  data() {
    return {
      predefined: [
        { name: 'bv-new', text: this.$t('general.new'), icon: 'plus' },
        { name: 'bv-edit', text: this.$t('general.edit'), icon: 'pencil-fill' },
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
      return this.icon || this.findPredefined?.icon
    },

    hasIcon() {
      return this.icon || this.findPredefined?.icon
    },
  },
}
</script>
