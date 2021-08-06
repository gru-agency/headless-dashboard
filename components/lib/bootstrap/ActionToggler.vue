<template>
  <b-link v-b-toggle :href="getTarget" :class="getVariant" @click.prevent>
    <span class="d-flex align-items-center" :class="{ 'justify-content-between': iconRight }">
      <slot>
        <span class="mr-2"> {{ text || options }} </span>
      </slot>

      <icon :icon="icon"></icon>
    </span>
  </b-link>
</template>

<script>
export default {
  name: 'ActionToggler',

  props: {
    text: { type: String, default: undefined },
    target: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    icon: { type: Array, default: () => ['far', 'chevron-down'] },
    iconRight: { type: Boolean, default: false },
  },

  data() {
    return { options: this.$t('general.additionalOptions') }
  },

  computed: {
    getTarget() {
      return this.target ? `#${this.target}` : '#'
    },

    getVariant() {
      return this.variant ? `text-${this.variant}` : undefined
    },
  },
}
</script>

<style lang="scss" scoped>
.collapsed .fa-chevron-down {
  transform: rotate(0deg);
  transition: transform 0.25s ease-in-out;
}

.not-collapsed .fa-chevron-down {
  transform: rotate(-180deg);
  transition: transform 0.25s ease-in-out;
}
</style>
