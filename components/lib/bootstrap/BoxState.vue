<template>
  <b-card-body class="row justify-content-center p-sm-4" :class="{ 'h-half-screen': fixedHeight }">
    <div class="align-self-center">
      <div class="text-wrap" :class="[centerAlign ? 'text-center' : 'text-left']" style="max-width: 500px">
        <slot name="icon">
          <b-card-text class="mb-8">
            <icon v-if="isLoading" :preset="getPresetIcon" class="fa-lg" pulse></icon>
            <span v-else>
              <b-avatar v-if="iconHolder" size="3rem" variant="light" class="shadow-sm" rounded>
                <icon :icon="icon" :preset="getPresetIcon" :class="getIconClass" class="fa-lg"></icon>
              </b-avatar>
              <icon v-else :icon="icon" :preset="getPresetIcon" :class="getIconClass" class="fa-lg"></icon>
            </span>
          </b-card-text>
        </slot>

        <slot name="title">
          <b-card-title v-if="getTitle">{{ getTitle }}</b-card-title>
        </slot>

        <slot name="subtitle">
          <b-card-text v-if="subtitle">{{ subtitle }}</b-card-text>
        </slot>

        <slot name="body">
          <b-card-text class="text-secondary">{{ getBody }}</b-card-text>
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
            :modal="modal"
            @click="sendEvents"
          ></action-button>
        </slot>
      </div>
    </div>
  </b-card-body>
</template>

<script>
export default {
  name: 'BoxState',

  props: {
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
    fixedHeight: { type: Boolean, default: false },
    iconPreset: { type: String, default: undefined },
    modal: { type: String, default: undefined },
  },

  data() {
    return {
      searchTitle: this.$t('general.noResultTitle'),
      searchSubtitle: this.$t('general.noResultSubtitle'),
    }
  },

  computed: {
    getPresetIcon() {
      if (this.iconPreset) return this.iconPreset

      switch (this.state) {
        case 'loading':
          return 'bv-loading'
        case 'empty':
          return 'bv-empty'
        case 'error':
          return 'bv-error'
        case 'success':
          return 'bv-success'
        case 'search':
          return 'bv-search'
        default:
          return undefined
      }
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
      return this.state === 'loading'
    },

    isEmpty() {
      return this.state === 'empty'
    },

    isError() {
      return this.state === 'error'
    },

    isSuccess() {
      return this.state === 'success'
    },

    shouldShowButton() {
      return !this.btnHide && (this.btnText || this.getPresetAction)
    },

    getTitle() {
      return this.state === 'search' ? this.searchTitle : this.title
    },

    getBody() {
      return this.state === 'search' ? this.searchSubtitle : this.body
    },

    bodyLetterCount() {
      return this.body?.length || 0
    },

    centerAlign() {
      return this.bodyLetterCount <= 120
    },
  },

  methods: {
    sendEvents() {
      this.$emit('click')
    },
  },
}
</script>
