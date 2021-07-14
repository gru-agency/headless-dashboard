<template>
  <fa
    v-if="hasIcon"
    :id="id"
    :icon="getIcon"
    :size="size"
    :fixed-width="fixedWidth"
    :rotation="rotation"
    :flip="flip"
    :spin="spin"
    :pulse="pulse"
    :border="border"
    :inverse="inverse"
    :swap-opacity="swapOpacity"
    :transform="transform"
    :symbol="symbol"
  ></fa>
</template>

<script>
export default {
  name: 'Icon',

  props: {
    preset: { type: String, default: undefined },
    id: { type: String, default: undefined },
    icon: { type: Array, default: () => null },
    size: { type: String, default: undefined },
    fixedWidth: { type: Boolean, default: true },
    rotation: { type: String, default: undefined },
    flip: { type: String, default: undefined },
    spin: { type: Boolean, default: false },
    pulse: { type: Boolean, default: false },
    border: { type: Boolean, default: false },
    inverse: { type: Boolean, default: false },
    swapOpacity: { type: Boolean, default: false },
    transform: { type: String, default: undefined },
    symbol: { type: String, default: undefined },
  },

  data() {
    return {
      presets: {
        'bv-empty': { icon: ['fad', 'empty-set'] },
        'bv-error': { icon: ['fad', 'exclamation-triangle'] },
        'bv-success': { icon: ['fad', 'check-double'] },
        'bv-loading': { icon: ['fad', 'spinner'] },
        'bv-person': { icon: ['fad', 'user-alt'] },
      },
    }
  },

  computed: {
    getPreset() {
      return this.presets[this.preset]
    },

    getIcon() {
      return this.icon || this.getPreset?.icon || undefined
    },

    hasIcon() {
      return this.icon || this.getPreset?.icon
    },
  },
}
</script>
