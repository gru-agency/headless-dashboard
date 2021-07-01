<template>
  <b-link
    :to="linkToParent ? getParentRoute : link"
    :class="getVariant"
    :disabled="disabled"
    :append="linkAppend"
    :prefetch="linkToParent || link ? true : false"
    @click.prevent="sendEvents"
  >
    <b-icon
      v-if="icon ? true : false"
      :icon="icon"
      :class="iconClass"
      :style="iconStyle"
      :shift-v="iconShiftV"
      :shift-h="iconShiftH"
      :font-scale="iconSize"
    ></b-icon>
    <span v-if="text ? true : false">
      <slot> {{ text }} </slot>
    </span>
  </b-link>
</template>

<script>
import { BIcon, BIconX, BIconArrowLeft } from 'bootstrap-vue'

export default {
  name: 'ActionLink',

  components: {
    BIcon,
    BIconX, // eslint-disable-line vue/no-unused-components
    BIconArrowLeft, // eslint-disable-line vue/no-unused-components
  },

  props: {
    text: { type: String, default: undefined },
    link: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    linkAppend: { type: Boolean, default: false },
    linkToParent: { type: Boolean, default: false },
    // not recommended to use since icon is import explicitly
    icon: { type: String, default: undefined },
    iconClass: { type: String, default: undefined },
    iconStyle: { type: String, default: undefined },
    iconShiftV: { type: String, default: undefined },
    iconShiftH: { type: String, default: undefined },
    iconSize: { type: Number, default: 1 },
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
      this.$nuxt.$emit('e3LinkClick')
    },
  },
}
</script>
