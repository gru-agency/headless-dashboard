<template>
  <b-link
    :to="linkToParent ? getParentRoute : link"
    :class="getVariant"
    :disabled="disabled"
    :append="linkAppend"
    :prefetch="linkToParent || link ? true : false"
    @click.prevent="sendEvents"
  >
    <icon :icon="icon"></icon>

    <span v-if="text ? true : false">
      <slot>{{ text }}</slot>
    </span>
  </b-link>
</template>

<script>
export default {
  name: 'ActionLink',

  props: {
    text: { type: String, default: undefined },
    link: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    linkAppend: { type: Boolean, default: false },
    linkToParent: { type: Boolean, default: false },
    icon: { type: Array, default: () => null },
  },

  computed: {
    getVariant() {
      return this.$ui.getTextVariant(this.variant)
    },

    getParentRoute() {
      return this.$utils.getParentRoute(this.$route.path)
    },
  },

  methods: {
    sendEvents() {
      this.$emit('click')
      this.$nuxt.$emit('bvLinkClick')
    },
  },
}
</script>
