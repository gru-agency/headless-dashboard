<template>
  <span>
    <!-- unable to use icon component because doesnt emit mouseover/mouseleave -->
    <fa :id="randomId" :icon="getIcon" class="text-secondary" @click.prevent="$emit('click')"></fa>

    <b-tooltip v-if="tooltip" :target="randomId" :triggers="triggers" :placement="placement">
      <slot></slot>
    </b-tooltip>
    <b-popover v-else :target="randomId" :triggers="triggers" :placement="placement">
      <slot></slot>
    </b-popover>
  </span>
</template>

<script>
export default {
  name: 'TipsField',

  props: {
    icon: { type: Array, default: () => null },
    preset: { type: String, default: undefined },
    triggers: { type: String, default: 'hover' },
    placement: { type: String, default: 'right' },
    tooltip: { type: Boolean, default: false },
  },

  data() {
    return {
      presets: {
        'bv-info': { icon: ['fas', 'info-square'] },
        'bv-eye': { icon: ['fad', 'eye'] },
        'bv-eye-slash': { icon: ['fad', 'eye-slash'] },
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

    randomId() {
      return 'bv_' + new Date().getTime()
    },
  },
}
</script>
