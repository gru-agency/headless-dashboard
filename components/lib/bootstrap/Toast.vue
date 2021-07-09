<template>
  <b-toast
    :id="id"
    toaster="b-toaster-bottom-center"
    :variant="getVariant"
    :no-auto-hide="noAutoHide"
    :auto-hide-delay="autoHideDelay"
    :static="isStatic"
    :solid="solid"
  >
    <template #toast-title>
      <icon :icon="getIcon" :variant="getVariant"></icon>
      <span class="mx-2"> {{ getTitle }} </span>
    </template>
    <slot> {{ message }} </slot>
  </b-toast>
</template>

<script>
export default {
  name: 'Toast',

  props: {
    preset: { type: String, default: undefined },
    id: { type: String, default: 'bvBottomCenter' },
    title: { type: String, default: undefined },
    message: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    solid: { type: Boolean, default: true },
    isStatic: { type: Boolean, default: false },
    noAutoHide: { type: Boolean, default: false },
    autoHideDelay: { type: [Number, String], default: 8000 },
    icon: { type: Array, default: () => null },
  },

  data() {
    return {
      presets: {
        error: {
          title: this.$t('general.error'),
          icon: ['fas', 'exclamation-triangle'],
          variant: 'danger',
        },
        success: {
          title: this.$t('general.success'),
          icon: ['fas', 'check-circle'],
          variant: 'success',
        },
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

    getVariant() {
      return this.variant || this.getPreset?.variant || undefined
    },

    getTitle() {
      return this.title || this.getPreset?.title || undefined
    },
  },
}
</script>
