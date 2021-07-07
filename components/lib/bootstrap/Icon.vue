<template>
  <fa
    v-if="icon"
    :id="id"
    :icon="icon"
    :class="getIconClass"
    :style="iconStyle"
    :size="iconSize"
    :fixed-width="iconWidthFixed"
    :rotation="iconRotation"
    :flip="iconFlip"
    :spin="iconSpin"
    :pulse="iconPulse"
    :border="iconBorder"
    :inverse="iconInverse"
    :swap-opacity="iconSwapOpacity"
    :transform="iconTransform"
    :symbol="iconSymbol"
  ></fa>
</template>

<script>
export default {
  name: 'Icon',

  props: {
    id: { type: String, default: undefined },
    icon: { type: Array, default: () => null },
    iconClass: { type: String, default: undefined },
    iconStyle: { type: String, default: undefined },
    iconSize: { type: String, default: undefined },
    iconWidthFixed: { type: Boolean, default: true },
    iconRotation: { type: String, default: undefined },
    iconFlip: { type: String, default: undefined },
    iconSpin: { type: Boolean, default: false },
    iconPulse: { type: Boolean, default: false },
    iconBorder: { type: Boolean, default: false },
    iconInverse: { type: Boolean, default: false },
    iconSwapOpacity: { type: Boolean, default: false },
    iconTransform: { type: String, default: undefined },
    iconSymbol: { type: String, default: undefined },
    // custom
    iconVariant: { type: String, default: undefined },
  },

  computed: {
    getIconClass() {
      const classes = [this.iconClass]
      classes.push(this.getIconVariant)
      return classes.join(' ').trim()
    },

    getIconVariant() {
      return this.$ui.getTextVariant(this.iconVariant)
    },
  },
}
</script>
