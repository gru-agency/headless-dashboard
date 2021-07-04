<template>
  <span>
    <!-- unable to use custom component because doesnt emit mouseover/mouseleave -->
    <fa :id="randomId" :icon="['fas', 'info-square']" class="text-secondary"></fa>

    <b-popover :target="randomId" :triggers="triggers" :placement="placement">
      <slot></slot>
    </b-popover>
  </span>
</template>

<script>
export default {
  name: 'TipsField',

  props: {
    triggers: { type: String, default: 'hover' },
    placement: { type: String, default: 'left' },
  },

  computed: {
    randomId() {
      return 'bv_' + new Date().getTime()
    },
  },
}
</script>
