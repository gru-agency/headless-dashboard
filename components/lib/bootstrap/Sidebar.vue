<template>
  <b-collapse
    :id="id"
    :class="{ 'border-right': rightBorder }"
    is-nav
    tag="aside"
    class="cb-sidebar d-lg-block z-dropdown of-y-auto bg-light"
  >
    <div class="pb-5">
      <slot></slot>
    </div>
  </b-collapse>
</template>

<script>
export default {
  name: 'Sidebar',

  props: {
    id: { type: String, default: undefined },
    rightBorder: { type: Boolean, default: false },
  },
}
</script>
