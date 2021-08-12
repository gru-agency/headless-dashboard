<template>
  <div class="my-4">
    <div v-if="stretch" class="d-flex">
      <div class="flex-grow-1">
        <action-button v-b-toggle="target" size="sm" block class="text-left btn-unstyled px-0">
          {{ getTextOnCollapse }} <icon v-if="!noIcon" :icon="icon" class="ml-2"></icon>
        </action-button>
      </div>
      <!-- default slot is needed to accommodate delete function, else will raise error -->
      <div><slot></slot></div>
      <div>
        <action-button v-b-toggle="target" size="sm" class="btn-unstyled">
          <icon :icon="icon"></icon>
        </action-button>
      </div>
    </div>
    <b-link v-else v-b-toggle="target" @click.prevent>
      {{ getTextOnCollapse }} <icon v-if="!noIcon" :icon="icon" class="ml-2"></icon>
    </b-link>
    <b-collapse :id="target" :visible="visible" @show="onShow" @hide="onHide">
      <div class="my-4"><slot name="collapsible"></slot></div>
    </b-collapse>
  </div>
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
    textOnHide: { type: String, default: undefined },
    visible: { type: Boolean, default: false },
    stretch: { type: Boolean, default: false },
    noIcon: { type: Boolean, default: false },
  },

  data() {
    return { options: this.$t('general.additionalOptions'), collapse: !this.visible }
  },

  computed: {
    getVariant() {
      return this.variant ? `text-${this.variant}` : undefined
    },

    getText() {
      return this.text || this.options
    },

    getTextOnCollapse() {
      return this.collapse ? this.textOnHide || this.getText : this.getText
    },
  },

  methods: {
    onShow() {
      this.collapse = false
    },

    onHide() {
      this.collapse = true
    },

    toggle() {},
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
