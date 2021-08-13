<template>
  <tips-field preset="bv-info" class="px-1">
    <b-tabs v-model="tabIndex" no-nav-style>
      <template #tabs-start>
        <b-nav-text role="presentation" tag="h6">{{ tabTitle }}</b-nav-text>
      </template>

      <template #tabs-end>
        <li role="presentation" class="flex-grow-1"></li>
        <b-nav-item
          :disabled="firstTab"
          role="presentation"
          link-classes="px-0 pr-1 text-primary"
          @click="tabIndex--"
        >
          <icon preset="bv-back"></icon>
        </b-nav-item>
        <b-nav-item
          :disabled="lastTab"
          role="presentation"
          link-classes="px-0 text-primary"
          @click="tabIndex++"
        >
          <icon preset="bv-forward"></icon>
        </b-nav-item>
      </template>

      <b-tab v-for="opt in pricing" :key="opt.text" title-link-class="d-none">
        <p class="text-secondary">{{ opt.tips }}</p>
      </b-tab>
    </b-tabs>
  </tips-field>
</template>

<script>
export default {
  props: {
    pricing: { type: Array, default: () => [] },
  },

  data() {
    return { tabIndex: 0 }
  },

  computed: {
    tabTitle() {
      if (this.tabIndex === 0) return this.pricing[0].text
      else if (this.tabIndex === 1) return this.pricing[1].text
      else return ''
    },

    firstTab() {
      return this.tabIndex === 0
    },

    lastTab() {
      return this.tabIndex === this.pricing.length - 1
    },
  },
}
</script>
