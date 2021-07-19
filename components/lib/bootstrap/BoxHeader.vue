<template>
  <b-card-header
    header-tag="header"
    header-bg-variant="white"
    :header-class="{ 'border-bottom-0': noBorder }"
  >
    <div v-if="parentLink" class="d-flex justify-content-between align-items-center mb-2">
      <action-link
        :text="parentLinkText"
        :icon="['fad', 'long-arrow-left']"
        :variant="parentLinkVariant || 'secondary'"
        :link-to-parent="parentLink"
      ></action-link>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <div>
        <b-card-title
          :title-tag="smartTitleTag"
          :class="{ 'mb-0': !subtitleText, 'font-weight-bolder': true }"
        >
          <slot name="title"> {{ titleText }} </slot>
        </b-card-title>
        <b-card-sub-title
          v-if="subtitleText"
          :sub-title-tag="subtitleTag"
          :sub-title-text-variant="subtitleVariant"
        >
          <slot name="subtitle"> {{ subtitleText }} </slot>
        </b-card-sub-title>
      </div>
      <div>
        <slot name="right">
          <action-button
            v-if="newBtn || editBtn || btnText"
            :preset="newBtn ? 'bv-new' : editBtn ? 'bv-edit' : undefined"
            :variant="btnVariant || newBtn ? 'primary' : editBtn ? 'light' : undefined"
            :text="btnText"
            :link="btnLink"
            :size="btnSize"
            :link-append="btnLinkAppend"
            @click="sendEvents(newBtn ? 'new' : editBtn ? 'edit' : 'click')"
          ></action-button>
        </slot>
      </div>
    </div>
  </b-card-header>
</template>

<script>
export default {
  name: 'BoxHeader',

  props: {
    titleText: { type: String, default: undefined },
    titleTag: { type: String, default: undefined },
    subtitleText: { type: String, default: undefined },
    subtitleTag: { type: String, default: 'h6' },
    subtitleVariant: { type: String, default: 'muted' },
    noBorder: { type: Boolean, default: false },
    newBtn: { type: Boolean, default: false },
    editBtn: { type: Boolean, default: false },
    btnText: { type: String, default: undefined },
    btnLink: { type: String, default: undefined },
    btnSize: { type: String, default: 'sm' },
    btnVariant: { type: String, default: undefined },
    btnLinkAppend: { type: Boolean, default: false },
    parentLink: { type: Boolean, default: false },
    parentLinkText: { type: String, default: undefined },
    parentLinkVariant: { type: String, default: undefined },
  },

  computed: {
    smartTitleTag() {
      return this.titleTag || (this.subtitleText ? 'h5' : 'h3')
    },
  },

  methods: {
    sendEvents(event) {
      this.$emit(event)
    },
  },
}
</script>
