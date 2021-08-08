<template>
  <b-navbar type="light" variant="light" fixed="top" class="border-bottom px-0">
    <b-container fluid="2xl">
      <b-row no-gutters class="w-100 justify-content-between px-4">
        <b-navbar-nav>
          <slot name="nav-start">
            <b-nav-text class="px-0 px-lg-2">
              <action-link icon-preset="bv-close" variant="secondary" link-to-parent></action-link>
            </b-nav-text>
            <b-nav-text v-if="title" class="px-2 pr-3 pr-lg-5">|</b-nav-text>
            <b-nav-text v-if="title">{{ title }}</b-nav-text>
          </slot>
        </b-navbar-nav>

        <b-navbar-nav class="flex-row">
          <slot name="nav-end"></slot>
        </b-navbar-nav>
      </b-row>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: 'FormNavBar',

  props: { title: { type: String, default: undefined } },
}
</script>
