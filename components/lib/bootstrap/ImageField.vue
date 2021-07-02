<template>
  <span>
    <b-avatar v-if="list.length === 0" size="3rem" variant="light" rounded>
      <b-icon :icon="icon" variant="secondary"></b-icon>
    </b-avatar>

    <b-avatar
      v-for="item in list.slice(0, max)"
      :key="item"
      :src="item"
      size="3rem"
      variant="light"
      class="mr-2"
      rounded
    >
    </b-avatar>
    <b-icon variant="secondary"></b-icon>
  </span>
</template>

<script>
import { BIcon, BIconBoxSeam } from 'bootstrap-vue'

export default {
  name: 'ImageField',

  components: {
    BIcon,
    BIconBoxSeam, // eslint-disable-line vue/no-unused-components
  },

  props: {
    image: { type: String, default: undefined },
    images: {
      type: Array,
      default() {
        return []
      },
    },
    max: { type: [Number, String], default: undefined },
    icon: { type: String, default: undefined },
  },

  computed: {
    list() {
      return this.image ? [this.image] : this.images
    },
  },
}
</script>
