<template>
  <span>
    <b-icon
      :id="randomId"
      :icon="icon || 'info-square-fill'"
      :class="iconClass"
      :style="iconStyle"
      :shift-v="iconShiftV"
      :shift-h="iconShiftH"
      :font-scale="iconSize"
      :variant="iconVariant"
      class="mx-1"
    ></b-icon>

    <b-popover :target="randomId" :triggers="triggers" :placement="placement">
      <slot></slot>
    </b-popover>
  </span>
</template>

<script>
import { BIcon, BIconInfoSquareFill } from 'bootstrap-vue'

export default {
  name: 'TipsField',

  components: {
    BIcon,
    BIconInfoSquareFill, // eslint-disable-line vue/no-unused-components
  },

  props: {
    triggers: { type: String, default: 'hover' },
    placement: { type: String, default: 'left' },
    // not recommended to use since icon is import explicitly
    icon: { type: String, default: undefined },
    iconClass: { type: String, default: undefined },
    iconStyle: { type: String, default: undefined },
    iconShiftV: { type: String, default: undefined },
    iconShiftH: { type: String, default: undefined },
    iconSize: { type: Number, default: 1 },
    iconVariant: { type: String, default: undefined },
  },

  computed: {
    randomId() {
      return 'bv_' + new Date().getTime()
    },
  },
}
</script>
