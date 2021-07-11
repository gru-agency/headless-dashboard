<template>
  <span>
    <!-- placeholder -->
    <b-avatar v-if="list.length === 0" size="3rem" variant="light" rounded>
      <icon :icon="icon"></icon>
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
  </span>
</template>

<script>
export default {
  name: 'ImageField',

  props: {
    image: { type: String, default: undefined },
    images: { type: Array, default: () => [] },
    max: { type: [Number, String], default: undefined },
    icon: { type: Array, default: () => null },
  },

  computed: {
    list() {
      return this.image ? [this.image] : this.images
    },
  },
}
</script>
