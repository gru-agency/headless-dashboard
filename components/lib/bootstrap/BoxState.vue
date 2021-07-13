<template>
  <b-card-body class="text-center p-sm-4">
    <slot name="icon">
      <b-card-text>
        <icon v-if="isLoading" :preset="getPresetIcon" size="2x" pulse></icon>
        <span v-else>
          <b-avatar v-if="iconHolder" size="3rem" variant="light" rounded>
            <icon :icon="icon" :preset="getPresetIcon" :class="getIconClass"></icon>
          </b-avatar>
          <icon v-else :icon="icon" :preset="getPresetIcon" :class="getIconClass" size="2x"></icon>
        </span>
      </b-card-text>
    </slot>

    <slot name="title">
      <b-card-title v-if="title">{{ title }}</b-card-title>
    </slot>

    <slot name="subtitle">
      <b-card-text v-if="subtitle">{{ subtitle }}</b-card-text>
    </slot>

    <slot name="body">
      <b-card-text class="text-secondary">{{ body }}</b-card-text>
    </slot>

    <slot name="action">
      <action-button
        v-if="shouldShowButton"
        :preset="getPresetAction"
        :variant="btnVariant"
        :text="btnText"
        :link="btnLink"
        :size="btnSize"
        :disabled="btnDisabled"
        :link-append="btnLinkAppend"
        :prefetch="btnLink ? true : false"
        @click="sendEvents"
      ></action-button>
    </slot>
  </b-card-body>
</template>

<script>
export default {
  name: 'BoxState',

  props: {
    empty: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    body: { type: String, default: undefined },
    btnText: { type: String, default: undefined },
    btnLink: { type: String, default: undefined },
    btnSize: { type: String, default: undefined },
    btnVariant: { type: String, default: undefined },
    btnHide: { type: Boolean, default: false },
    btnDisabled: { type: Boolean, default: false },
    btnLinkAppend: { type: Boolean, default: false },
    icon: { type: Array, default: () => null },
    iconClass: { type: String, default: undefined },
    // new props
    state: { type: String, default: undefined },
    subtitle: { type: String, default: undefined },
    iconHolder: { type: Boolean, default: false },
  },

  data() {
    return {}
  },

  computed: {
    getPresetIcon() {
      return this.icon
        ? undefined
        : this.isLoading
        ? 'bv-loading'
        : this.isEmpty
        ? 'bv-empty'
        : this.isError
        ? 'bv-error'
        : this.isSuccess
        ? 'bv-success'
        : undefined
    },

    getPresetIconVariant() {
      return this.isError ? 'text-danger' : this.isSuccess ? 'text-success' : undefined
    },

    getPresetAction() {
      return !this.btnText && this.isEmpty ? 'bv-new' : undefined
    },

    getIconClass() {
      return this.iconClass || this.getPresetIconVariant
    },

    isLoading() {
      return this.state === 'loading' || this.loading
    },

    isEmpty() {
      return this.state === 'empty' || this.empty
    },

    isError() {
      return this.state === 'error' || this.error
    },

    isSuccess() {
      return this.state === 'success' || this.success
    },

    shouldShowButton() {
      return !this.btnHide && (this.btnText || this.getPresetAction)
    },
  },

  methods: {
    sendEvents() {
      this.$emit('click')
    },
  },
}
</script>
