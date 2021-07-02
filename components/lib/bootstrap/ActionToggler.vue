<template>
  <b-link v-b-toggle :href="getTarget" :class="getVariant" class="stretched-link" @click.prevent>
    <slot>
      <span> {{ text }} </span>
    </slot>
    <b-icon
      v-if="icon ? true : false"
      :icon="icon"
      :class="getIconClass"
      :style="iconStyle"
      :shift-v="iconShiftV"
      :shift-h="iconShiftH"
      :font-scale="iconSize"
    ></b-icon>
  </b-link>
</template>

<script>
import { BIcon, BIconChevronDown } from 'bootstrap-vue'

export default {
  name: 'ActionToggler',

  components: {
    BIcon,
    BIconChevronDown, // eslint-disable-line vue/no-unused-components
  },

  props: {
    text: { type: String, default: undefined },
    target: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    // not recommended to use since icon is import explicitly
    icon: { type: String, default: 'chevron-down' },
    iconClass: { type: String, default: undefined },
    iconStyle: { type: String, default: undefined },
    iconShiftV: { type: String, default: undefined },
    iconShiftH: { type: String, default: undefined },
    iconSize: { type: Number, default: 1 },
    iconPlacement: { type: String, default: undefined },
  },

  computed: {
    getTarget() {
      return this.target ? '#'.concat(this.target) : '#'
    },

    getVariant() {
      return this.$ui.getTextVariant(this.variant)
    },

    getIconClass() {
      return {
        'mx-auto float-right': this.iconPlacement === 'right',
        [this.iconClass]: this.iconClass,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.collapsed > .bi-chevron-down {
  transform: rotate(0deg);
  transition: transform 0.5s ease-in-out;
}

.not-collapsed > .bi-chevron-down {
  transform: rotate(-180deg);
  transition: transform 0.5s ease-in-out;
}
</style>
